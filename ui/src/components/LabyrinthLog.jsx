export default function LabyrinthLog({state}) {
    const run = state.labyrinth?.activeRun;

    return (
        <section style={{marginBottom: 16}}>
            <h2>Labyrinth Log</h2>

            {!run ? (
                <div>No active run</div>
            ) : (
                <div>
                    <div><strong>Run ID:</strong> {run.id}</div>
                    <div><strong>Status:</strong> {run.completed ? "Completed" : "Active"}</div>
                    <div><strong>Current Node:</strong> {run.currentNode ?? "None"}</div>
                    <div><strong>Started Day:</strong> {run.startedDay}</div>

                    <h3>Summary</h3>
                    <ul>
                        <li>Combats: {run.summary?.combats ?? 0}</li>
                        <li>Wins: {run.summary?.wins ?? 0}</li>
                        <li>Losses: {run.summary?.losses ?? 0}</li>
                        <li>XP gained: {run.summary?.xpGained ?? 0}</li>
                        <li>Gold gained: {run.summary?.goldGained ?? 0}</li>
                    </ul>

                    <h3>Loot</h3>
                    {run.summary?.loot?.length ? (
                        <ul>
                            {run.summary.loot.map((drop) => (
                                <li key={drop.itemId}>
                                    {drop.itemId} x{drop.qty}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div>No loot found</div>
                    )}
                </div>
            )}
        </section>
    );
}
