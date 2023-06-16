"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotCorrectRightsError = void 0;
const BaseServiceError_1 = require("../BaseServiceError");
class NotCorrectRightsError extends BaseServiceError_1.BaseServiceError {
    displayMessage() {
        return "Du har desværre ikke rettigheder til at tilgå denne funktion";
    }
    displayTitle() {
        return "Problemer med rettigheder";
    }
    displaySettings() {
        const settings = new BaseServiceError_1.DisplaySettings();
        settings.displayInLargeDialog = true;
        settings.showLogoutButton = true;
        return settings;
    }
}
exports.NotCorrectRightsError = NotCorrectRightsError;
