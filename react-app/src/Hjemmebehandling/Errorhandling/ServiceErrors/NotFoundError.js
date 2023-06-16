"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotFoundError = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class NotFoundError extends BaseServiceError_1.BaseServiceError {
    displayMessage() {
        return "Ingen resultater med de givne informationer";
    }
    displayTitle() {
        return "Ikke fundet";
    }
}
exports.NotFoundError = NotFoundError;
