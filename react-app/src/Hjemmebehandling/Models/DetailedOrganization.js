"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimePeriod = exports.PhoneHour = void 0;
const SimpleOrganization_1 = __importDefault(require("./SimpleOrganization"));
class DetailedOrganization extends SimpleOrganization_1.default {
}
exports.default = DetailedOrganization;
class PhoneHour {
    constructor() {
        this.days = [];
        this.timePeriods = [];
    }
    toString() {
        let toReturn = "";
        toReturn += this.days.join(", ");
        toReturn += ", ";
        toReturn += this.timePeriods.map(x => x.fromTime + "-" + x.toTime).join(" og ");
        return toReturn;
    }
}
exports.PhoneHour = PhoneHour;
class TimePeriod {
}
exports.TimePeriod = TimePeriod;
