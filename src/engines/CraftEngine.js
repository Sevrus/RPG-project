export class CraftEngine {

    static recipes = {
        ironIngot: {
            ingredients: {
                ironOre_5kg: 2,
                charcoal_5kg: 1
            },
            timeCost: 2, // hours
            goldCost: 5  // tool wear
        }
    };

    static canCraft(state, recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) throw new Error("Unknown recipe");

        for (const [item, qty] of Object.entries(recipe.ingredients)) {
            if ((state.player.inventory[item] ?? 0) < qty) {
                return false;
            }
        }

        return state.player.money >= recipe.goldCost;

    }

    static craft({ state, recipeId }) {
        const recipe = this.recipes[recipeId];
        if (!recipe) throw new Error("Unknown recipe");

        if (!this.canCraft(state, recipeId)) {
            throw new Error("Craft requirements not met");
        }

        // Remove ingredients
        for (const [item, qty] of Object.entries(recipe.ingredients)) {
            state.player.inventory[item] -= qty;
            if (state.player.inventory[item] === 0) {
                delete state.player.inventory[item];
            }
        }

        // Money cost
        state.player.money -= recipe.goldCost;

        // Add crafted item
        state.player.inventory[recipeId] =
            (state.player.inventory[recipeId] ?? 0) + 1;

        // Advance time (simple placeholder)
        state.time.hour = (state.time.hour ?? 0) + recipe.timeCost;

        return {
            type: "CRAFT",
            recipeId,
            timeCost: recipe.timeCost,
            goldCost: recipe.goldCost,
            day: state.time.day
        };
    }
}
