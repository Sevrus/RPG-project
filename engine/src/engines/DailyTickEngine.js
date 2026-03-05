import { MarketEngine } from "./MarketEngine.js";
import { ContractEngine } from "./ContractEngine.js";

export class DailyTickEngine {
    static tickDay(state) {
        MarketEngine.tickDay(state);
        ContractEngine.tickDay(state);
    }
}
