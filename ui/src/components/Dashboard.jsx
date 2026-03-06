export default function Dashboard({ state, onAdvanceHour, onAdvanceDay, onSave, onLoad }) {
    const t = state.time ?? {};
    const loc = state.location ?? {};
    const p = state.player ?? {};

    return (
        <div style={{ marginBottom: 12 }}>
            <h2>Dashboard</h2>

            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                    <div><strong>Time</strong></div>
                    <div>Day {t.day} — {String(t.hour).padStart(2, "0")}:{String(t.minute).padStart(2, "0")}</div>
                </div>

                <div>
                    <div><strong>Location</strong></div>
                    <div>{loc.city ?? "Unknown"}</div>
                </div>

                <div>
                    <div><strong>Player</strong></div>
                    <div>Money: {p.money}</div>
                    <div>Level: {p.level} (XP: {p.xp})</div>
                    <div>BP: {p.bp}</div>
                    <div>HP: {p.hp} | ATK: {p.attack} | DEF: {p.defense}</div>
                </div>
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button onClick={onAdvanceHour}>+1 hour</button>
                <button onClick={onAdvanceDay}>+24 hours</button>
                <button onClick={onSave}>Save</button>
                <button onClick={onLoad}>Load</button>
            </div>
        </div>
    );
}
