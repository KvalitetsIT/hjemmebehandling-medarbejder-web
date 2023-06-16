"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadGatewayError = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class BadGatewayError extends BaseServiceError_1.BaseServiceError {
    constructor(errorMessage, url) {
        super();
        this.errorMessage = errorMessage;
        this.url = url;
    }
    displayUrl() {
        return this.url;
    }
    displayMessage() {
        return this.errorMessage;
    }
    displayTitle() {
        return "502) Fejl i tredjepart";
    }
}
exports.BadGatewayError = BadGatewayError;
