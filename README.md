# Isekai Sandbox Engine

Un moteur RPG sandbox orienté ultra-système avec économie dynamique.
Objectif : permettre une expérience libre (artisanat, commerce, construction, exploration, labyrinthe) sans dépendre d’une IA pour la logique mécanique.

---

## 🎯 Vision

Créer un sandbox systémique dans lequel :

- Le joueur peut vivre comme artisan, marchand, propriétaire, aventurier ou noble.
- L’économie est dynamique et régionale.
- Le labyrinthe est un secteur indépendant.
- L’IA ne gère que la narration et les dialogues.
- Toutes les mécaniques sont déterministes et contrôlées par le moteur JS.

---

## 🧱 Architecture actuelle

### Core
- `GameState` : état global unique du monde.

### Data
- `basePrices` : prix de référence issus des tables du monde.
- `itemCatalog` : métadonnées des objets (catégories, tags, unités).

### Engines
- `MarketEngine`
    - Prix dynamiques par ville
    - Indices d’offre/demande
    - Taxes locales
    - Spread achat/vente
    - Fluctuation quotidienne
    - Système d’événements (famine, caravane, festival)

---

## 💰 Market Engine – v0

Fonctionnalités :

- `getBuyPrice(city, itemId, state)`
- `getSellPrice(city, itemId, state)`
- `tickDay(state)`
- `applyEvent(city, event, state)`

### Modèle économique

Prix final =

basePrice × indexVille × (1 + taxe) × spread

Contraintes :
- Index borné entre 0.7 et 1.3 (v0)
- Spread vente < Spread achat
- Prix arrondis à l’unité

---

## 🚧 Prochaines briques

- Inventory + TransactionEngine
- CraftEngine
- PropertyEngine
- ContractEngine
- TimeEngine avancé
- LabyrinthEngine (module isolé)

---

## 🧠 Philosophie

- Petites briques stables
- Systèmes indépendants et testables
- Pas d’usine à gaz prématurée
- Construction progressive

---

## 📌 État

Version : `market-core-v0`
Statut : fondation en place
