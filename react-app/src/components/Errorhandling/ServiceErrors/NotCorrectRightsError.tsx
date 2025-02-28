import { BaseServiceError, DisplaySettings } from "../BaseServiceError";


export class NotCorrectRightsError extends BaseServiceError {
    displayMessage() {
        return "Du har desværre ikke rettigheder til at tilgå denne funktion. Kontakt Servicedesk";
    }
    
    displayTitle(){
        return "Problemer med rettigheder"
    }

    displaySettings(): DisplaySettings {
        const settings = new DisplaySettings();
        settings.displayInLargeDialog = true;
        settings.showLogoutButton = true;
        return settings;
    }
}