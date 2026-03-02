export const monsters = [
    { id: "slime", name: "Slime", level: 1, hp: 12, attack: 4, defense: 1, xp: 30, gold: 5 },
    { id: "goblin", name: "Goblin", level: 2, hp: 18, attack: 6, defense: 2, xp: 50, gold: 10 },
];

// Utility
export function pickMonsterByFloor(floor = 1) {
    // v1: simple weighting by floor; later you can do proper tables
    const candidates = monsters.filter(m => m.level <= floor + 1);
    return candidates[Math.floor(Math.random() * candidates.length)];
}
