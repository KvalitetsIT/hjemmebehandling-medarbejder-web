"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedError = void 0;
const BaseApiError_1 = require("../BaseApiError");
class NotImplementedError extends BaseApiError_1.BaseApiError {
    constructor() {
        super(new Response(), "error", -1);
    }
    displayMessage() {
        return "Denne feature er endnu ikke klar";
    }
    displayTitle() {
        return "Ikke implementeret";
    }
}
exports.NotImplementedError = NotImplementedError;
