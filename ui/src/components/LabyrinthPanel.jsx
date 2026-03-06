import { LabyrinthEngine } from "@engine/engines/LabyrinthEngine.js";

export default function LabyrinthPanel({gameState, onSync}) {
    const activeRun = gameState.labyrinth?.activeRun;

    const handleStartRun = () => {
        try {
            LabyrinthEngine.startRun({
                state: gameState,
                floors: 1,
                roomsPerFloor: 5
            });
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleStepRoom = () => {
        try {
            LabyrinthEngine.resolveCurrentNode({state: gameState});
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleFinishRun = () => {
        try {
            LabyrinthEngine.finishRun({state: gameState});
            onSync();
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <section style={{marginBottom: 16}}>
            <div style={{display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12}}>
                <button onClick={handleStartRun}>Start Run</button>
                <button onClick={handleStepRoom} disabled={!activeRun || activeRun.completed}>Step current Room</button>
                <button onClick={handleFinishRun} disabled={!activeRun || !activeRun.completed}>Finish Run</button>
            </div>

            <div>
                <strong>Status:</strong>{" "}
                {activeRun
                    ? activeRun.completed
                        ? "Completed"
                        : `Active (${activeRun.currentNodeId ?? "no current node"})`
                    : "No active run"
                }
            </div>

            {activeRun && (
                <div style={{marginTop: 8}}>
                    <div><strong>Run Id:</strong> {activeRun.id}</div>
                    <div><strong>Combats:</strong> {activeRun.summary?.combats ?? 0}</div>
                    <div><strong>Wins:</strong> {activeRun.summary?.wins ?? 0}</div>
                    <div><strong>Losses:</strong> {activeRun.summary?.losses ?? 0}</div>
                    <div><strong>XP gained:</strong> {activeRun.summary?.xpGained ?? 0}</div>
                    <div><strong>Gold gained:</strong> {activeRun.summary?.goldGained ?? 0}</div>
                </div>
            )}
        </section>
    );
}


