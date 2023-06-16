"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisplaySettings = exports.BaseServiceError = void 0;
class BaseServiceError extends Error {
    displayMessage() {
        return "";
    }
    displayTitle() {
        return "";
    }
    displayUrl() {
        return "";
    }
    displaySettings() {
        return new DisplaySettings();
    }
}
exports.BaseServiceError = BaseServiceError;
class DisplaySettings {
    constructor() {
        /**
         * Big white dialog that cannot be closed
         */
        this.displayInLargeDialog = false;
        /**
         * This will display a button that runs window.location.replace("/");
         */
        this.showRefreshButton = true;
        /**
         * This will display a button that runs window.location.href = "/oauth2/sign_out";
         */
        this.showLogoutButton = false;
        /**
         * This will display a button that will close the dialog
         */
        this.showCloseButton = false;
        /**
         * A function run when close-button is pressed
         */
        this.whenClosed = () => { };
    }
}
exports.DisplaySettings = DisplaySettings;
