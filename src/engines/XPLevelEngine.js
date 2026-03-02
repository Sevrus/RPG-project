export class XPLevelEngine {

    static xpToNextLevel(level) {
        // Simple quadratic progression
        return 100 * level * level;
    }

    static gainXP(state, amount) {
        if (amount <= 0) return;

        state.player.xp += amount;

        const leveledUp = [];

        while (state.player.xp >= this.xpToNextLevel(state.player.level)) {
            state.player.xp -= this.xpToNextLevel(state.player.level);
            state.player.level += 1;

            // Simple BP reward
            const bpGain = 5;
            state.player.bp += bpGain;

            leveledUp.push({
                newLevel: state.player.level,
                bpGained: bpGain
            });
        }

        return {
            type: "XP_GAIN",
            amount,
            currentLevel: state.player.level,
            remainingXP: state.player.xp,
            levelUps: leveledUp
        };
    }
}
