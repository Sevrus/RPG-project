import { CombatResolver } from "./CombatResolver.js";
import { pickMonsterByFloor } from "../data/monsters.js";
import { rollLoot } from "../data/lootTables.js";
import { TransactionEngine } from "./TransactionEngine.js";
import { XPLevelEngine } from "./XPLevelEngine.js";

const makeId = (prefix = "run") => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

export class LabyrinthEngine {
    static startRun({ state, floors = 1, roomsPerFloor = 5 }) {
        if (state.labyrinth.activeRun) {
            throw new Error("A run is already active");
        }

        const runId = makeId("run");
        const nodes = [];

        // v1: linear nodes but generic model (node-based)
        for (let f = 1; f <= floors; f++) {
            for (let r = 1; r <= roomsPerFloor; r++) {
                const nodeId = `f${f}_r${r}`;
                const type = (r === roomsPerFloor) ? "boss" : (Math.random() < 0.7 ? "combat" : "empty");

                nodes.push({
                    id: nodeId,
                    floor: f,
                    index: nodes.length,
                    type,
                    cleared: false,
                });
            }
        }

        const run = {
            id: runId,
            startedDay: state.time.day,
            nodes,
            currentNodeId: nodes[0]?.id ?? null,
            completed: false,
            summary: {
                combats: 0,
                wins: 0,
                losses: 0,
                xpGained: 0,
                goldGained: 0,
                loot: [], // aggregated [{itemId, qty}]
            },
        };

        state.labyrinth.activeRun = run;

        return { type: "LAB_RUN_START", runId, floors, roomsPerFloor, day: state.time.day };
    }

    static getActiveRun(state) {
        const run = state.labyrinth.activeRun;
        if (!run) throw new Error("No active run");
        return run;
    }

    static getCurrentNode(run) {
        if (!run.currentNodeId) return null;
        return run.nodes.find(n => n.id === run.currentNodeId) ?? null;
    }

    static moveToNextNode(run) {
        const current = this.getCurrentNode(run);
        if (!current) return null;

        const nextIndex = current.index + 1;
        const next = run.nodes[nextIndex] ?? null;

        run.currentNodeId = next ? next.id : null;
        if (!next) run.completed = true;

        return next;
    }

    static resolveCurrentNode({ state }) {
        const run = this.getActiveRun(state);
        const node = this.getCurrentNode(run);
        if (!node) throw new Error("Run has no current node (already completed?)");
        if (node.cleared) throw new Error("Current node already cleared");

        const events = [];

        if (node.type === "empty") {
            node.cleared = true;
            events.push({ type: "LAB_NODE_EMPTY", nodeId: node.id, floor: node.floor });
        } else {
            // Combat (boss uses higher floor)
            run.summary.combats += 1;

            const floor = node.floor;
            const monster = pickMonsterByFloor(node.type === "boss" ? floor + 1 : floor);

            const combat = CombatResolver.resolve(state.player, monster);
            events.push({
                type: node.type === "boss" ? "LAB_BOSS_FIGHT" : "LAB_COMBAT",
                nodeId: node.id,
                floor,
                monsterId: monster.id,
                monsterName: monster.name,
                outcome: combat.outcome,
                combatLog: combat.log,
            });

            if (combat.outcome === "WIN") {
                run.summary.wins += 1;
                node.cleared = true;

                // Rewards
                const xpReceipt = XPLevelEngine.gainXP(state, monster.xp);
                run.summary.xpGained += monster.xp;
                events.push(xpReceipt);

                state.player.money += (monster.gold ?? 0);
                run.summary.goldGained += (monster.gold ?? 0);

                const drops = rollLoot();
                for (const drop of drops) {
                    // We add items directly (no city pricing involved)
                    // Reuse TransactionEngine helper to keep inventory logic centralized
                    TransactionEngine.addItem?.(state, drop.itemId, drop.qty);
                    // If your TransactionEngine doesn't expose addItem, just do:
                    // state.player.inventory[drop.itemId] = (state.player.inventory[drop.itemId] ?? 0) + drop.qty;

                    // Aggregate summary loot
                    const existing = run.summary.loot.find(x => x.itemId === drop.itemId);
                    if (existing) existing.qty += drop.qty;
                    else run.summary.loot.push({ itemId: drop.itemId, qty: drop.qty });
                }

                events.push({ type: "LAB_LOOT", nodeId: node.id, drops });
            } else {
                run.summary.losses += 1;
                // v1: death ends run
                run.completed = true;
                run.currentNodeId = null;
                events.push({ type: "LAB_RUN_FAILED", runId: run.id });
            }
        }

        // Advance to next node if still running
        if (!run.completed) {
            const next = this.moveToNextNode(run);
            events.push({ type: "LAB_MOVE_NEXT", nextNodeId: next?.id ?? null, completed: run.completed });
        }

        return { type: "LAB_STEP_RESULT", nodeId: node.id, events };
    }

    static finishRun({ state }) {
        const run = this.getActiveRun(state);
        if (!run.completed) {
            throw new Error("Run is not completed yet");
        }

        const summary = run.summary;
        const runId = run.id;

        state.labyrinth.activeRun = null;

        return { type: "LAB_RUN_END", runId, summary, day: state.time.day };
    }
}
