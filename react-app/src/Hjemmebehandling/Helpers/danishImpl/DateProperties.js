"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DateProperties {
    constructor(showDate, showMonth, showYear, showTime) {
        this.showDate = showDate !== null && showDate !== void 0 ? showDate : true;
        this.showMonth = showMonth !== null && showMonth !== void 0 ? showMonth : true;
        this.showYear = showYear !== null && showYear !== void 0 ? showYear : true;
        this.showTime = showTime !== null && showTime !== void 0 ? showTime : true;
    }
}
exports.default = DateProperties;
