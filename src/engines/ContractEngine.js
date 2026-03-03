import { XPLevelEngine } from "./XPLevelEngine.js";

const makeId = (prefix = "ctr") => `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

export class ContractEngine {
    static createDelivery({ cityFrom, cityTo, itemId, qty, rewardGold, rewardXP, durationDays }) {
        const id = makeId("delivery");
        return {
            id,
            type: "DELIVERY",
            status: "AVAILABLE",
            createdDay: null,
            acceptedDay: null,
            deadlineDay: null,
            cityFrom,
            cityTo,
            requirements: [{ itemId, qty }],
            rewards: { gold: rewardGold, xp: rewardXP },
            durationDays
        };
    }

    static createCraftOrder({ cityFrom, cityTo, itemId, qty, rewardGold, rewardXP, durationDays }) {
        const id = makeId("craft");
        return {
            id,
            type: "CRAFT_ORDER",
            status: "AVAILABLE",
            createdDay: null,
            acceptedDay: null,
            deadlineDay: null,
            cityFrom,
            cityTo,
            requirements: [{ itemId, qty }],
            rewards: { gold: rewardGold, xp: rewardXP },
            durationDays
        };
    }

    static publishContract(state, contract) {
        contract.createdDay = state.time.day;
        state.contracts.available.push(contract);
        return { type: "CONTRACT_PUBLISHED", contractId: contract.id, day: state.time.day };
    }

    static acceptContract(state, contractId) {
        const idx = state.contracts.available.findIndex(c => c.id === contractId);
        if (idx === -1) throw new Error("Contract not found in available list");

        const contract = state.contracts.available.splice(idx, 1)[0];
        contract.status = "ACTIVE";
        contract.acceptedDay = state.time.day;
        contract.deadlineDay = state.time.day + (contract.durationDays ?? 1);

        state.contracts.active.push(contract);

        return { type: "CONTRACT_ACCEPTED", contractId, deadlineDay: contract.deadlineDay, day: state.time.day };
    }

    static canComplete(state, contract) {
        // v1: require being in the destination city
        if (state.location?.city !== contract.cityTo) return false;

        for (const req of contract.requirements) {
            const have = state.player.inventory[req.itemId] ?? 0;
            if (have < req.qty) return false;
        }
        return true;
    }

    static completeContract(state, contractId) {
        const idx = state.contracts.active.findIndex(c => c.id === contractId);
        if (idx === -1) throw new Error("Contract not found in active list");

        const contract = state.contracts.active[idx];
        if (!this.canComplete(state, contract)) {
            throw new Error("Contract requirements not met (location/items)");
        }

        // Remove required items
        for (const req of contract.requirements) {
            state.player.inventory[req.itemId] -= req.qty;
            if (state.player.inventory[req.itemId] === 0) delete state.player.inventory[req.itemId];
        }

        // Rewards
        state.player.money += contract.rewards.gold ?? 0;
        const xpReceipt = XPLevelEngine.gainXP(state, contract.rewards.xp ?? 0);

        // Move to completed
        state.contracts.active.splice(idx, 1);
        contract.status = "COMPLETED";
        contract.completedDay = state.time.day;
        state.contracts.completed.push(contract);

        return {
            type: "CONTRACT_COMPLETED",
            contractId,
            rewards: contract.rewards,
            xpReceipt,
            day: state.time.day
        };
    }

    static tickDay(state) {
        // Expire active contracts
        const stillActive = [];
        for (const c of state.contracts.active) {
            if (c.deadlineDay != null && state.time.day > c.deadlineDay) {
                c.status = "EXPIRED";
                c.expiredDay = state.time.day;
                state.contracts.failed.push(c);
            } else {
                stillActive.push(c);
            }
        }
        state.contracts.active = stillActive;
    }
}
