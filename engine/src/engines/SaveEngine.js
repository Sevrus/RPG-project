const SAVE_KEY = "isekai-sandbox-save";

function getStorage() {

    // Browser environment
    if (typeof localStorage !== "undefined") {
        return localStorage;
    }

    // Node fallback (memory storage)
    return {
        data: {},
        setItem(key, value) {
            this.data[key] = value;
        },
        getItem(key) {
            return this.data[key] ?? null;
        }
    };
}

const storage = getStorage();

export class SaveEngine {
    static saveGame(state) {
        const payload = {
            saveVersion: 1,
            saveAt: Date.now(),
            state
        };


        storage.setItem(SAVE_KEY, JSON.stringify(payload));

        return {
            type: "GAME_SAVED",
            timestamp: payload.saveAt
        };
    }

    static loadGame() {
        const raw = storage.getItem(SAVE_KEY);
        if (!raw) return null;

        const payload = JSON.parse(raw);
        const state = payload.state;

        // Ajout de la date de chargement
        state.meta = {
            ...state.meta,
            loadedAt: Date.now()
        };

        // future migration point
        if (payload.saveVersion !== 1) {
            console.warn("Save version mismatch", payload.saveVersion);
        }

        return state;
    }

    static exportSave(state) {
        return JSON.stringify({
            saveVersion: 1,
            saveAt: Date.now(),
            state
        }, null, 2);
    }

    static importSave(jsonString) {
        const payload = JSON.parse(jsonString);

        if (!payload.state) {
            throw new Error("Invalid save format");
        }

        storage.setItem(SAVE_KEY, JSON.stringify(payload));

        return payload.state;
    }
}
