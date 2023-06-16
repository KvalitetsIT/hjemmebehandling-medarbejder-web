"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnitType = exports.BooleanAnswer = exports.NumberAnswer = exports.StringAnswer = void 0;
class StringAnswer {
    ToString() {
        return this.answer ? this.answer : "";
    }
}
exports.StringAnswer = StringAnswer;
class NumberAnswer {
    ToString() {
        let toReturn = "";
        toReturn += this.answer == undefined ? "" : this.answer;
        if (this.unit)
            toReturn += " " + this.unit.toString();
        return toReturn;
    }
}
exports.NumberAnswer = NumberAnswer;
class BooleanAnswer {
    ToString() {
        return this.answer ? "Ja" : "Nej";
    }
}
exports.BooleanAnswer = BooleanAnswer;
var UnitType;
(function (UnitType) {
    UnitType["KG"] = "KG";
    UnitType["DEGREASE_CELSIUS"] = "Grader";
    UnitType["NOUNIT"] = "";
})(UnitType = exports.UnitType || (exports.UnitType = {}));
