import { BaseServiceError, DisplaySettings } from "../BaseServiceError"

export class UnsupportedError extends BaseServiceError {
    concerningObject: unknown
    unsupportedReadableDescription: string

    constructor(concerningObject: unknown, unsupportedReadableDescription: string) {
        super()

        this.concerningObject = concerningObject
        this.unsupportedReadableDescription = unsupportedReadableDescription
    }
    displayTitle(): string {
        return "Ikke supporteret"
    }

    displayMessage(): string {
        return this.unsupportedReadableDescription;
    }

    displayUrl(): string {
        return JSON.stringify(this.concerningObject);
    }
    displaySettings(): DisplaySettings {
        const settings = new DisplaySettings();
        settings.displayInLargeDialog = true;
        return settings;
    }
}