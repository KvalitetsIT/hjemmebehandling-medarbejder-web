import { BaseServiceError } from "./BaseServiceError";

export class BadRequestError extends BaseServiceError {
    errorMessage: string;

    constructor(errorMessage: string) {
        super()
        this.errorMessage = errorMessage
    }

    displayMessage() {
        return this.errorMessage;
    }
    displayTitle(){
        return "Ugyldig forespørgsel"
    }
}