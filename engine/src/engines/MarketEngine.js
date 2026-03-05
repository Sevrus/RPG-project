import {basePrices} from "../data/basePrices.js";
import {itemCatalog} from "../data/itemCatalog.js";

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export class MarketEngine {
    static getBasePrice(itemId) {
        const meta = itemCatalog[itemId];
        if (!meta) throw new Error(`Unknown item id: ${itemId}`);

        const base = basePrices?.[meta.category]?.[itemId];
        if (typeof base !== "number") throw new Error(`No base price for ${meta.category}.${itemId}`);

        return base;
    }

    static getMarket(city, state) {
        const market = state.markets[city];
        if (!market) throw new Error(`Unknown city market: ${city}`);
        return market;
    }

    static getIndex(city, itemId, state) {
        const meta = itemCatalog[itemId];
        const market = this.getMarket(city, state);
        const idx = market.index?.[meta.category];
        if (typeof idx !== "number") throw new Error(`No market index for ${city}.${meta.category}`);
        return idx;
    }

    // Prix final (avant spread) : base * index * (1 + taxe)
    static getReferencePrice(city, itemId, state) {
        const base = this.getBasePrice(itemId);
        const idx = this.getIndex(city, itemId, state);
        const market = this.getMarket(city, state);

        const taxed = base * idx * (1 + (market.taxRate ?? 0));
        return Math.round(taxed);
    }

    static getBuyPrice(city, itemId, state) {
        const market = this.getMarket(city, state);
        const ref = this.getReferencePrice(city, itemId, state);
        return Math.max(1, Math.round(ref * (market.spread?.buy ?? 1.0)));
    }

    static getSellPrice(city, itemId, state) {
        const market = this.getMarket(city, state);
        const ref = this.getReferencePrice(city, itemId, state);
        return Math.max(0, Math.round(ref * (market.spread?.sell ?? 0.6)));
    }

    // Petite fluctuation quotidienne
    static tickDay(state) {
        for (const market of Object.values(state.markets)) {
            for (const cat of Object.keys(market.index)) {
                const variation = (Math.random() - 0.5) * 0.10; // ±5%
                market.index[cat] = clamp(market.index[cat] + variation, 0.7, 1.3);
            }
        }
        state.time.day += 1;
    }

    // Événements (hooks)
    static applyEvent(city, event, state) {
        const market = this.getMarket(city, state);

        switch (event.type) {
            case "FAMINE":
                market.index.food = clamp(market.index.food + 0.25, 0.7, 1.8);
                market.flags.push("famine");
                break;

            case "CARAVAN_MATERIALS_IN":
                market.index.materials = clamp(market.index.materials - 0.15, 0.5, 1.3);
                market.flags.push("caravan_materials_in");
                break;

            case "FESTIVAL":
                market.index.services = clamp(market.index.services + 0.20, 0.7, 1.6);
                market.flags.push("festival");
                break;

            default:
                throw new Error(`Unknown market event: ${event.type}`);
        }
    }
}
