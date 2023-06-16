import { BaseServiceError } from "../BaseServiceError";

export class NotFoundError extends BaseServiceError {
    displayMessage() {
        return "Ingen resultater med de givne informationer";
    }
    displayTitle(){
        return "Ikke fundet"
    }
}