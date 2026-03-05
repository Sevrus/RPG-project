export class CombatResolver {
    static resolve({ player, monster, rng = Math.random }) {
        const p = {
            name: "Player",
            hp: player.hp ?? 30,
            attack: player.attack ?? 7,
            defense: player.defense ?? 2,
        };

        const m = {
            id: monster.id,
            name: monster.name,
            hp: monster.hp,
            attack: monster.attack,
            defense: monster.defense,
        };

        const log = [];
        let round = 1;

        const hit = (atk, def) => {
            // Small variance to avoid fully deterministic outcomes (v1)
            const variance = 0.9 + rng() * 0.2; // 0.9..1.1
            const raw = Math.floor(atk * variance);
            return Math.max(1, raw - def);
        };

        while (p.hp > 0 && m.hp > 0 && round <= 50) {
            // Player attacks
            {
                const dmg = hit(p.attack, m.defense);
                m.hp -= dmg;
                log.push(`R${round}: Player hits ${m.name} for ${dmg} (monster hp=${Math.max(0, m.hp)})`);
                if (m.hp <= 0) break;
            }

            // Monster attacks
            {
                const dmg = hit(m.attack, p.defense);
                p.hp -= dmg;
                log.push(`R${round}: ${m.name} hits Player for ${dmg} (player hp=${Math.max(0, p.hp)})`);
            }

            round += 1;
        }

        const outcome = p.hp > 0 ? "WIN" : "LOSE";

        return {
            outcome,
            playerHPAfter: Math.max(0, p.hp),
            monsterHPAfter: Math.max(0, m.hp),
            log,
        };
    }
}
