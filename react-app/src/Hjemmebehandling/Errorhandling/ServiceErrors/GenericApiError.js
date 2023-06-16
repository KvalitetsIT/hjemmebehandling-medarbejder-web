"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericApiError = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class GenericApiError extends BaseServiceError_1.BaseServiceError {
    constructor(apiError) {
        super();
        this.apiError = apiError;
    }
    displayMessage() {
        return this.apiError.displayMessage();
    }
    displayTitle() {
        return this.apiError.displayTitle();
    }
}
exports.GenericApiError = GenericApiError;
