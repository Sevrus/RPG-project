import { PropertyEngine } from "@engine/engines/PropertyEngine.js";

export default function PropertyPanel({ gameState, state, onSync }) {
    const properties = state.player?.properties ?? [];
    const firstProperty = properties[0];

    const handleBuyProperty = () => {
        try {
            PropertyEngine.buyProperty({
                state: gameState,
                city: state.location?.city ?? "Port-Nova",
                propertyId: "house_1",
                price: 200
            });
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleDepositIronIngot = () => {
        try {
            if (!firstProperty) {
                alert("No property owned");
                return;
            }

            PropertyEngine.depositItem({
                state: gameState,
                propertyId: firstProperty.id,
                itemId: "ironIngot",
                qty: 1
            });
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleWithdrawIronIngot = () => {
        try {
            if (!firstProperty) {
                alert("No property owned");
                return;
            }

            PropertyEngine.withdrawItem({
                state: gameState,
                propertyId: firstProperty.id,
                itemId: "ironIngot",
                qty: 1
            });
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <section style={{ marginBottom: 16 }}>
            <h2>Property</h2>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <button onClick={handleBuyProperty}>Buy Test Property</button>
                <button onClick={handleDepositIronIngot}>Deposit 1 Iron Ingot</button>
                <button onClick={handleWithdrawIronIngot}>Withdraw 1 Iron Ingot</button>
            </div>

            <div>
                <strong>Owned properties:</strong> {properties.length}
            </div>
        </section>
    );
}
