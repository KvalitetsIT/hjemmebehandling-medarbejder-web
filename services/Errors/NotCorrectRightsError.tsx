import { BaseServiceError } from "./BaseServiceError";

export class NotCorrectRightsError extends BaseServiceError {
    displayMessage() {
        return "Du har desværre ikke rettigheder til at tilgå denne funktion";
    }
    displayTitle(){
        return "Problemer med rettigheder"
    }
}