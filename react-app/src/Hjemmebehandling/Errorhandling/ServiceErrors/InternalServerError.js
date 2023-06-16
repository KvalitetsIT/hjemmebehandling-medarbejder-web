"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class InternalServerError extends BaseServiceError_1.BaseServiceError {
    displayMessage() {
        return "Serveren kunne ikke udføre den anmodet handling";
    }
    displayTitle() {
        return "Intern server fejl";
    }
    displaySettings() {
        const settings = new BaseServiceError_1.DisplaySettings();
        settings.displayInLargeDialog = true;
        return settings;
    }
}
exports.InternalServerError = InternalServerError;
