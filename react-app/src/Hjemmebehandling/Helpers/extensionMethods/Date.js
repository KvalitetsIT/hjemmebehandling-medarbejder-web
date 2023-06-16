"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
Date.prototype.compareTo = function (otherDate) {
    return this.getTime() - otherDate.getTime();
};
