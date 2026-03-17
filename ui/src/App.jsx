import { useEffect, useState } from "react";

import { gameState } from "@engine/core/GameState.js";
import { TimeEngine } from "@engine/engines/TimeEngine.js";
import { SaveEngine } from "@engine/engines/SaveEngine.js";

import Dashboard from "./components/Dashboard.jsx";
import StateViewer from "./components/StateViewer.jsx";
import LabyrinthPanel from "./components/LabyrinthPanel.jsx";
import ContractPanel from "./components/ContractPanel.jsx";
import TabBar from "./components/TabBar.jsx";
import InventoryPanel from "./components/InventoryPanel.jsx";
import ContractList from "./components/ContractList.jsx";
import LabyrinthLog from "./components/LabyrinthLog.jsx";
import MarketPanel from "./components/MarketPanel.jsx";
import CraftPanel from "./components/CraftPanel.jsx";
import PropertyPanel from "./components/PropertyPanel.jsx";

const clone = (x) => JSON.parse(JSON.stringify(x));

export default function App() {
    const tabs = [
        "Dashboard",
        "Inventory",
        "Market",
        "Craft",
        "Property",
        "Contracts",
        "Labyrinth",
        "Debug"
    ];

    const [activeTab, setActiveTab] = useState("Dashboard");
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
            <h1>Isekai Sandbox Engine – UI v0.6</h1>

            <TabBar tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

            {activeTab === "Dashboard" && (
                <Dashboard
                    state={state}
                    onAdvanceHour={onAdvanceHour}
                    onAdvanceDay={onAdvanceDay}
                    onSave={onSave}
                    onLoad={onLoad}
                />
            )}

            {activeTab === "Inventory" && <InventoryPanel state={state} />}

            {activeTab === "Market" && (
                <MarketPanel gameState={gameState} state={state} onSync={sync} />
            )}

            {activeTab === "Craft" && (
                <CraftPanel gameState={gameState} onSync={sync} />
            )}

            {activeTab === "Property" && (
                <PropertyPanel gameState={gameState} state={state} onSync={sync} />
            )}

            {activeTab === "Contracts" && (
                <>
                    <ContractPanel gameState={gameState} onSync={sync} />
                    <ContractList state={state} />
                </>
            )}

            {activeTab === "Labyrinth" && (
                <>
                    <LabyrinthPanel gameState={gameState} onSync={sync} />
                    <LabyrinthLog state={state} />
                </>
            )}

            {activeTab === "Debug" && <StateViewer state={state} />}
        </div>
    );
}
