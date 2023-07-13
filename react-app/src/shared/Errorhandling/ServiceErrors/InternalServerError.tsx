import { BaseServiceError, DisplaySettings } from "../BaseServiceError";

export class InternalServerError extends BaseServiceError {
    displayMessage() {
        return "Serveren kunne ikke udføre den anmodet handling";
    }
    displayTitle(){
        return "Intern server fejl"
    }
    displaySettings(): DisplaySettings {
        const settings = new DisplaySettings();
        settings.displayInLargeDialog = true;
        return settings;
    }
}