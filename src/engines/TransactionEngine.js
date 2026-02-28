import { MarketEngine } from "./MarketEngine.js";

export class TransactionEngine {
    // --- Inventory helpers ---
    static getQty(state, itemId) {
        return state.player.inventory[itemId] ?? 0;
    }

    static addItem(state, itemId, qty) {
        if (qty <= 0) throw new Error("Quantity must be > 0");
        state.player.inventory[itemId] = this.getQty(state, itemId) + qty;
    }

    static removeItem(state, itemId, qty) {
        if (qty <= 0) throw new Error("Quantity must be > 0");

        const current = this.getQty(state, itemId);
        if (current < qty) throw new Error("Not enough items in inventory");

        const next = current - qty;
        if (next === 0) delete state.player.inventory[itemId];
        else state.player.inventory[itemId] = next;
    }

    // --- Money helpers ---
    static spend(state, amount) {
        if (amount < 0) throw new Error("Amount must be >= 0");
        if (state.player.money < amount) throw new Error("Not enough money");
        state.player.money -= amount;
    }

    static earn(state, amount) {
        if (amount < 0) throw new Error("Amount must be >= 0");
        state.player.money += amount;
    }

    // --- Transactions ---
    static buy({ state, city, itemId, qty }) {
        const unitPrice = MarketEngine.getBuyPrice(city, itemId, state);
        const total = unitPrice * qty;

        this.spend(state, total);
        this.addItem(state, itemId, qty);

        return {
            type: "BUY",
            city,
            itemId,
            qty,
            unitPrice,
            total,
            day: state.time.day
        };
    }

    static sell({ state, city, itemId, qty }) {
        const unitPrice = MarketEngine.getSellPrice(city, itemId, state);
        const total = unitPrice * qty;

        this.removeItem(state, itemId, qty);
        this.earn(state, total);

        return {
            type: "SELL",
            city,
            itemId,
            qty,
            unitPrice,
            total,
            day: state.time.day
        };
    }

    // Optional: move items between containers later (house chest, cart, etc.)
}
