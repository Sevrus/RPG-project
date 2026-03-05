export class PropertyEngine {

    static buyProperty({ state, city, propertyId, price }) {
        if (state.player.money < price) {
            throw new Error("Not enough money");
        }

        state.player.money -= price;

        const property = {
            id: propertyId,
            city,
            type: "house",
            storage: {},
            upgrades: []
        };

        state.player.properties.push(property);

        return {
            type: "PROPERTY_PURCHASE",
            propertyId,
            city,
            price,
            day: state.time.day
        };
    }

    static depositItem({ state, propertyId, itemId, qty }) {
        const property = state.player.properties.find(p => p.id === propertyId);
        if (!property) throw new Error("Property not found");

        const playerQty = state.player.inventory[itemId] ?? 0;
        if (playerQty < qty) throw new Error("Not enough items");

        state.player.inventory[itemId] -= qty;
        if (state.player.inventory[itemId] === 0) {
            delete state.player.inventory[itemId];
        }

        property.storage[itemId] =
            (property.storage[itemId] ?? 0) + qty;
    }

    static withdrawItem({ state, propertyId, itemId, qty }) {
        const property = state.player.properties.find(p => p.id === propertyId);
        if (!property) throw new Error("Property not found");

        const storedQty = property.storage[itemId] ?? 0;
        if (storedQty < qty) throw new Error("Not enough in storage");

        property.storage[itemId] -= qty;
        if (property.storage[itemId] === 0) {
            delete property.storage[itemId];
        }

        state.player.inventory[itemId] =
            (state.player.inventory[itemId] ?? 0) + qty;
    }
}
