import { useEffect, useState } from "react";

import { gameState } from "@engine/core/GameState.js";
import { TimeEngine } from "@engine/engines/TimeEngine.js";
import { SaveEngine } from "@engine/engines/SaveEngine.js";

import Dashboard from "./components/Dashboard.jsx";
import StateViewer from "./components/StateViewer.jsx";
import LabyrinthPanel from "./components/LabyrinthPanel.jsx";
import ContractPanel from "./components/ContractPanel.jsx";
import InventoryPanel from "./components/InventoryPanel.jsx";
import ContractList from "./components/ContractList.jsx";
import LabyrinthLog from "./components/LabyrinthLog.jsx";

const clone = (x) => JSON.parse(JSON.stringify(x));

export default function App() {
    const [state, setState] = useState(clone(gameState));

    const sync = () => setState(clone(gameState));

    const onAdvanceHour = () => {
        TimeEngine.advanceHours(gameState, 1);
        sync();
    };

    const onAdvanceDay = () => {
        TimeEngine.advanceHours(gameState, 24);
        sync();
    };

    const onSave = () => {
        SaveEngine.saveGame(gameState);
        sync();
    };

    const onLoad = () => {
        const loaded = SaveEngine.loadGame();
        if (loaded) Object.assign(gameState, loaded);
        sync();
    };

    useEffect(() => {
        sync();
    }, []);

    return (
        <div style={{ padding: 16, fontFamily: "sans-serif" }}>
            <h1>Isekai Sandbox Engine – UI v0.3</h1>

            <Dashboard
                state={state}
                onAdvanceHour={onAdvanceHour}
                onAdvanceDay={onAdvanceDay}
                onSave={onSave}
                onLoad={onLoad}
            />

            <LabyrinthPanel gameState={gameState} onSync={sync} />
            <ContractPanel gameState={gameState} onSync={sync} />

            <h2>GameState (debug)</h2>
            <InventoryPanel state={state} />
            <ContractList state={state} />
            <LabyrinthLog state={state} />
            <StateViewer state={state} />
        </div>
    );
}
