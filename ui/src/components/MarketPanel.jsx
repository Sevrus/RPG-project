import { MarketEngine } from "@engine/engines/MarketEngine.js";
import { TransactionEngine } from "@engine/engines/TransactionEngine.js";

const TEST_ITEMS = ["ironOre_5kg", "charcoal_5kg", "woodPlank_2m", "ironIngot"];

export default function MarketPanel({ gameState, state, onSync }) {
    const city = state.location?.city ?? "Port-Nova";

    const handleBuy = (itemId) => {
        try {
            TransactionEngine.buy({
                state: gameState,
                city,
                itemId,
                qty: 1
            });
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleSell = (itemId) => {
        try {
            TransactionEngine.sell({
                state: gameState,
                city,
                itemId,
                qty: 1
            });
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <section style={{marginBottom: 16}}>
            <h2>Market</h2>

            <div><strong>City:</strong> {city}</div>

            <ul>
                {TEST_ITEMS.map((itemId) => {
                    const buyPrice = MarketEngine.getBuyPrice(city, itemId, gameState);
                    const sellPrice = MarketEngine.getSellPrice(city, itemId, gameState);

                    return (
                        <li key={itemId} style={{ marginBottom: 8 }}>
                                <strong>{itemId}</strong> - Buy: {buyPrice} / Sell: {sellPrice}
                            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                                <button onClick={() => handleBuy(itemId)}>Buy 1</button>
                                <button onClick={() => handleSell(itemId)}>Sell 1</button>
                            </div>
                        </li>
                    );
                    })}
            </ul>
        </section>
    );
}
