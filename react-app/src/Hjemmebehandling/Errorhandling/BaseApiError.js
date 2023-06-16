"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseApiError = void 0;
class BaseApiError extends Error {
    constructor(response, errorMessage, errorCode) {
        super();
        this.response = response;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.message = this.displayTitle() + ": " + errorMessage;
    }
    displayUrl() {
        return this.response ? this.response.url.includes("?") ? this.response.url.split("?")[0] : this.response.url : "Ingen url tilgængelig";
    }
    displayMessage() {
        var _a;
        return (_a = this.errorMessage) !== null && _a !== void 0 ? _a : "Ingen fejlbesked tilgængelig";
    }
    displayTitle() {
        var _a, _b;
        if (!this.response) {
            return "Manglende respons";
        }
        let responseStatus = (_a = this.response.status) !== null && _a !== void 0 ? _a : "-1";
        let responseText = (_b = this.response.statusText) !== null && _b !== void 0 ? _b : "";
        return "(" + responseStatus + ") " + responseText;
    }
}
exports.BaseApiError = BaseApiError;
