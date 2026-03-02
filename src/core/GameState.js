export const gameState = {
    time: {
        day: 1,
        hour: 8,
        minute: 0,
    },

    location: { city: "Port-Nova" },

    player: {
      money: 1000,
      inventory: {},
        properties: [],
    },

    markets: {
        "Port-Nova": {
            // indices par catégorie (base)
            index: { food: 1.0, materials: 1.0, services: 1.0 },
            taxRate: 0.03, // 3% (exemple)
            spread: { buy: 1.0, sell: 0.6 }, // le marchand rachète à 60% du prix
            flags: [], // ex: ["festival", "famine"]
        },

        "Forge-Sainte": {
            index: { food: 1.1, materials: 0.9, services: 1.0 },
            taxRate: 0.02,
            spread: { buy: 1.0, sell: 0.6 },
            flags: [],
        },
    },
};
