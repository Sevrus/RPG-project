# Isekai Sandbox Engine – Architecture

## 1. Long-Term Vision

The project evolves in three major phases:

1. Solo Application (local save + UI)
2. Web Application (multi-session + backend)
3. Mobile Extension

The Core Engine remains unchanged across all phases.

Core principle:
The engine must be independent from both frontend and backend layers.

---

## 2. Core Engine Design

The engine is modular and deterministic.

Current and planned modules:

- GameState
- MarketEngine
- TransactionEngine
- CraftEngine
- PropertyEngine
- TimeEngine (planned)
- XP / LevelEngine (planned)
- LabyrinthEngine (planned)
- ContractEngine (planned)

Rules:

- No engine depends on UI.
- No engine depends on backend.
- All state transitions go through explicit methods.
- GameState must always be JSON-serializable.

---

## 3. Phase 1 – Solo Application

Objective:
Playable sandbox locally via web UI.

### Core Systems to Finalize

- TimeEngine v1
- XP / LevelEngine v1
- LabyrinthEngine v1
- ContractEngine v1

### Minimal UI

- Dashboard
- Inventory
- Market
- Craft
- Property
- Dungeon run log

### Persistence

- Local JSON save
- localStorage
- Manual export/import

---

## 4. Phase 2 – Web Application

Objective:
Transform the solo engine into a multi-session web platform.

### Backend (Node)

- REST API
- Server-side engine execution
- Action validation
- GameState storage

### Database

- SQLite (initial)
- PostgreSQL (scaling)

Core tables:

- users
- saves
- world_snapshots
- event_logs

Security principle:
Clients never directly modify GameState.
All actions are validated and executed server-side.

---

## 5. Phase 3 – Mobile

When gameplay is stable:

- PWA optimization
  or
- React Native adaptation

The Core Engine remains unchanged.

---

## 6. AI Integration (Final Layer)

AI never modifies GameState directly.

Flow:

AI → proposes narrative intent  
Engine → validates mechanically  
GameState → updated  
AI → narrates outcome

Strict separation between mechanics and storytelling.

---

## 7. World Data Strategy

The engine is structurally generic but currently targets a specific world dataset.

- Engines are system-agnostic.
- World data (cities, items, prices, factions) is defined in data modules.
- Internal identifiers remain language-neutral.
- Narrative and UI layers handle localization.

---

## 8. Development Methodology

Golden rule:

1 feature = 1 branch  
1 branch = 1 merge  
1 merge = STOP

Each milestone must produce a playable demo.
