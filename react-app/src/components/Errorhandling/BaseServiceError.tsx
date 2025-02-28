
export class BaseServiceError extends Error {
    displayMessage(): string {
        return "";
    }
    displayTitle(): string {
        return "";
    }
    displayUrl(): string {
        return "";
    }
    displaySettings(): DisplaySettings {
        return new DisplaySettings();
    }
}

export class DisplaySettings {

    /**
     * Big white dialog that cannot be closed
     */
    displayInLargeDialog: boolean = false;

    /**
     * This will display a button that runs window.location.replace("/");
     */
    showRefreshButton: boolean = true;

    /**
     * This will display a button that runs window.location.href = "/oauth2/sign_out";
     */
    showLogoutButton: boolean = false;

    /**
     * This will display a button that will close the dialog
     */
    showCloseButton: boolean = false;

    /**
     * A function run when close-button is pressed
     */
    whenClosed: () => void = () => { }
}