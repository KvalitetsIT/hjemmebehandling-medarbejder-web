"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownServiceError = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class UnknownServiceError extends BaseServiceError_1.BaseServiceError {
    constructor(error) {
        super();
        this.error = error;
        this.message = this.displayMessage();
    }
    displayTitle() {
        return "Ukendt fejl";
    }
    displayMessage() {
        let message = "";
        message += "Der skete en ukendt fejl";
        return message;
    }
    displaySettings() {
        const settings = new BaseServiceError_1.DisplaySettings();
        settings.displayInLargeDialog = true;
        return settings;
    }
}
exports.UnknownServiceError = UnknownServiceError;
