import { MarketEngine } from "./MarketEngine.js";

export class TimeEngine {

    static advanceMinutes(state, minutes) {
        if (minutes <= 0) return;

        state.time.minute += minutes;

        while (state.time.minute >= 60) {
            state.time.minute -= 60;
            state.time.hour += 1;
        }

        while (state.time.hour >= 24) {
            state.time.hour -= 24;
            state.time.day += 1;

            // Daily hook
            MarketEngine.tickDay(state);
        }
    }

    static advanceHours(state, hours) {
        this.advanceMinutes(state, hours * 60);
    }
}
