import { ContractEngine } from "@engine/engines/ContractEngine.js";

export default function ContractPanel({gameState, onSync}) {
    const contracts = gameState.contracts ?? {
        available: [],
        active: [],
        completed: [],
        failed: []
    };

    const handlePublishTestContract = () => {
        try {
            const contract = ContractEngine.createDelivery({
                cityFrom: "Port-Nova",
                cityTo: "Port-Nova",
                itemId: "ironIngot",
                qty: 1,
                rewardGold: 120,
                rewardXP: 80,
                durationDays: 2
            });

            ContractEngine.publishContract(gameState, contract);
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleAcceptFirst = () => {
        try {
            const first = contracts.available[0];
            if (!first) {
                alert("No available contracts");
                return;
            }

            ContractEngine.acceptContract(gameState, first.id);
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleCompleteFirst = () => {
        try {
            const first = contracts.active[0];
            if (!first) {
                alert("No active contracts");
                return;
            }

            ContractEngine.completeContract(gameState, first.id);
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleGrantTestItem = () => {
        gameState.player.inventory.ironIngot =
            (gameState.player.inventory.ironIngot ?? 0) + 1;
        onSync();
    };

    return (
        <section style={{marginBottom: 16}}>
            <h2>Contracts</h2>

            <div style={{display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12}}>
                <button onClick={handlePublishTestContract}>Publish test delivery</button>
                <button onClick={handleAcceptFirst}>Accept first available</button>
                <button onClick={handleCompleteFirst}>Complete first active</button>
                <button onClick={handleGrantTestItem}>Grant 1 iron ingot</button>
            </div>

            <div><strong>Available:</strong> {contracts.available.length}</div>
            <div><strong>Active:</strong> {contracts.active.length}</div>
            <div><strong>Completed:</strong> {contracts.completed.length}</div>
            <div><strong>Rejected:</strong> {contracts.failed.length}</div>
        </section>
    );
}
