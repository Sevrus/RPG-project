import { CraftEngine } from "@engine/engines/CraftEngine.js";

export default function CraftPanel({ gameState, onSync }) {
    const handleCraftIronIngot = () => {
        try {
            CraftEngine.craft({
                state: gameState,
                recipeId: "ironIngot"
            });
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <section style={{ marginBottom: 16 }}>
            <h2>Crafting</h2>

            <button onClick={ handleCraftIronIngot }>Craft iron ingot</button>
        </section>
    );
};
