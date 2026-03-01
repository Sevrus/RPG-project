# Isekai Sandbox Engine

A systemic RPG sandbox engine built around deterministic mechanics and a dynamic economy.

The goal is to create a living simulation where the player can act as artisan, merchant, property owner, explorer, or dungeon runner — without relying on AI for mechanical logic.

---

## 🎯 Vision

Build a systemic sandbox where:

- The player can live as an artisan, merchant, adventurer, or noble.
- The economy is dynamic and regional.
- The labyrinth operates as an independent system.
- AI handles only narration and dialogue.
- All mechanics are deterministic and controlled by the JS engine.

---

## 🧱 Current Architecture

### Core
- `GameState` – Single global world state (fully serializable).

### Data
- `basePrices` – Reference prices derived from world tables.
- `itemCatalog` – Item metadata (categories, tags, units).

### Engines
- `MarketEngine`
  - Dynamic city pricing
  - Supply/demand indexes
  - Local taxes
  - Buy/sell spread
  - Daily fluctuation
  - Event system (famine, caravan, festival)

- `TransactionEngine`
  - Centralized inventory and money handling
  - `buy()` / `sell()` with structured receipts

- `CraftEngine`
  - Deterministic recipe system
  - Ingredient consumption
  - Time and gold cost
  - Refined item production

- `PropertyEngine`
  - Property acquisition
  - Per-property storage
  - Deposit / withdraw mechanics

---

## 💰 Economic Model (v0)

Final price formula:

basePrice × cityIndex × (1 + tax) × spread

Constraints:
- Index bounded between 0.7 and 1.3 (v0)
- Sell spread < Buy spread
- Prices rounded to whole units

---

## 🚧 Roadmap (Next Milestones)

- TimeEngine v1
- XP / LevelEngine v1
- LabyrinthEngine v1
- ContractEngine v1

See `ARCHITECTURE.md` for the full roadmap and long-term evolution plan.

---

## 🧠 Philosophy

- Small stable modules
- Independent and testable systems
- No premature complexity
- Progressive construction

---

## 📌 Status

Version: `core-systems-foundation`  
Status: economy, crafting, and property systems operational
