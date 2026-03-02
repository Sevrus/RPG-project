export const lootTable = [
    { itemId: "ironOre_5kg", chance: 0.25, min: 1, max: 1 },
    { itemId: "charcoal_5kg", chance: 0.20, min: 1, max: 1 },
    { itemId: "woodPlank_2m", chance: 0.15, min: 1, max: 1 },
];

export function rollLoot(rng = Math.random) {
    const drops = [];
    for (const entry of lootTable) {
        if (rng() < entry.chance) {
            const qty = entry.min + Math.floor(rng() * (entry.max - entry.min + 1));
            drops.push({ itemId: entry.itemId, qty });
        }
    }
    return drops;
}
