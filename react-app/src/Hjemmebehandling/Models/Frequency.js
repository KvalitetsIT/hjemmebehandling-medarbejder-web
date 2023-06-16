"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DayEnum = exports.FrequencyEnum = exports.Frequency = void 0;
class Frequency {
    constructor() {
        this.days = [];
    }
    ToString() {
        let toReturn = "";
        this.days.sort(this.compareDayEnum);
        for (let i = 0; i < this.days.length; i++) {
            if (i !== 0)
                toReturn += ", ";
            toReturn += this.days[i].slice(0, 3) + "";
        }
        toReturn += this.repeated ? " (" + this.repeated + ")" : "";
        toReturn += this.deadline ? " senest kl " : "";
        toReturn += this.deadline ? this.deadline : "";
        return toReturn;
    }
    compareDayEnum(a, b) {
        const weekdayOrder = [DayEnum.Monday, DayEnum.Tuesday, DayEnum.Wednesday, DayEnum.Thursday, DayEnum.Friday, DayEnum.Saturday, DayEnum.Sunday];
        return weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b);
    }
}
exports.Frequency = Frequency;
var FrequencyEnum;
(function (FrequencyEnum) {
    FrequencyEnum["Never"] = "Gentages ikke";
    FrequencyEnum["WEEKLY"] = "Ugentligt";
    FrequencyEnum["EVERYOTHERWEEK"] = "Hver anden uge";
    FrequencyEnum["MONTHLY"] = "M\u00E5nedligt";
    FrequencyEnum["YEARLY"] = "\u00C5rligt";
})(FrequencyEnum = exports.FrequencyEnum || (exports.FrequencyEnum = {}));
var DayEnum;
(function (DayEnum) {
    DayEnum["Monday"] = "Mandag";
    DayEnum["Tuesday"] = "Tirsdag";
    DayEnum["Wednesday"] = "Onsdag";
    DayEnum["Thursday"] = "Torsdag";
    DayEnum["Friday"] = "Fredag";
    DayEnum["Saturday"] = "L\u00F8rdag";
    DayEnum["Sunday"] = "S\u00F8ndag";
})(DayEnum = exports.DayEnum || (exports.DayEnum = {}));
