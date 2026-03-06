export default function InventoryPanel({state}) {
    const player = state.player ?? {};
    const inventory = player.inventory ?? {};
    const properties = player.properties ?? [];
    const firstProperty = properties[0];
    const storage = firstProperty?.storage ?? {};

    return (
        <section style={{marginBottom: 16}}>
            <h2>Inventory</h2>

            <div>
                <strong>Money:</strong> {player.money ?? 0}
            </div>

            <h3>Player Inventory</h3>
            {Object.keys(inventory).length === 0 ? (
                <div>No items in inventory</div>
            ) : (
                <ul>
                    {Object.entries(inventory).map(([itemId, qty]) => (
                        <li key={itemId}>
                            {itemId}: {qty}
                        </li>
                    ))}
                </ul>
            )}

            <h3>First Property Storage</h3>
            {Object.keys(storage).length === 0 ? (
                <div>No items in storage</div>
            ) : (
                <ul>
                    {Object.entries(storage).map(([itemId, qty]) => (
                        <li key={itemId}>
                            {itemId}: {qty}
                        </li>
                    ))}
                </ul>
            )
            }
        </section>
    );
}
