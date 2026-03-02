export class CombatResolver {
    static resolve(player, monster, rng = Math.random) {
        // Player baseline v1 (placeholder). Later: stats, gear, skills, d100, etc.
        const p = {
            name: "Player",
            hp: player.hp ?? 30,
            attack: player.attack ?? 7,
            defense: player.defense ?? 2,
        };

        const m = {
            name: monster.name,
            hp: monster.hp,
            attack: monster.attack,
            defense: monster.defense,
        };

        const log = [];
        let round = 1;

        while (p.hp > 0 && m.hp > 0 && round <= 50) {
            // Player attacks
            {
                const variance = 0.9 + rng() * 0.2; // 0.9..1.1
                const raw = Math.floor(p.attack * variance);
                const dmg = Math.max(1, raw - m.defense);
                m.hp -= dmg;
                log.push(`R${round}: Player hits ${m.name} for ${dmg} (monster hp=${Math.max(0, m.hp)})`);
                if (m.hp <= 0) break;
            }

            // Monster attacks
            {
                const variance = 0.9 + rng() * 0.2;
                const raw = Math.floor(m.attack * variance);
                const dmg = Math.max(1, raw - p.defense);
                p.hp -= dmg;
                log.push(`R${round}: ${m.name} hits Player for ${dmg} (player hp=${Math.max(0, p.hp)})`);
            }

            round += 1;
        }

        return {
            outcome: p.hp > 0 ? "WIN" : "LOSE",
            playerHPAfter: Math.max(0, p.hp),
            log,
        };
    }
}
