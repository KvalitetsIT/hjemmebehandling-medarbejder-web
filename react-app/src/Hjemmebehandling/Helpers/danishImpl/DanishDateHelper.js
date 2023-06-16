"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Frequency_1 = require("../../Models/Frequency");
const DateProperties_1 = __importDefault(require("./DateProperties"));
class DanishDateHelper {
    constructor() {
        this.days = [
            Frequency_1.DayEnum.Sunday,
            Frequency_1.DayEnum.Monday,
            Frequency_1.DayEnum.Tuesday,
            Frequency_1.DayEnum.Wednesday,
            Frequency_1.DayEnum.Thursday,
            Frequency_1.DayEnum.Friday,
            Frequency_1.DayEnum.Saturday
        ];
    }
    DateToString(date, properties) {
        if (!properties)
            properties = new DateProperties_1.default();
        let toReturn = "";
        if (properties.showDate) {
            toReturn += this.toTwoDigits(date.getDate());
        }
        if (properties.showMonth) {
            toReturn += "-";
            toReturn += this.toTwoDigits(date.getMonth() + 1); // Zero-indexed month.. Beacause JS..
        }
        if (properties.showYear) {
            toReturn += "-";
            toReturn += date.getFullYear();
        }
        if (properties.showTime) {
            toReturn += " kl. ";
            toReturn += this.toTwoDigits(date.getHours());
            toReturn += ":";
            toReturn += this.toTwoDigits(date.getMinutes());
        }
        return toReturn;
    }
    toTwoDigits(makeToTwoDigits) {
        const string = makeToTwoDigits.toString();
        let toReturn = string;
        if (toReturn.length < 2)
            toReturn = "0" + toReturn;
        return toReturn;
    }
    DayIndexToDay(dayIndex) {
        return this.days[dayIndex];
    }
}
exports.default = DanishDateHelper;
