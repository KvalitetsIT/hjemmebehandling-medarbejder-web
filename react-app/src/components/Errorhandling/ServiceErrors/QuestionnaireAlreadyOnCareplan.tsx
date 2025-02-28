import { BaseServiceError } from "../BaseServiceError";

export class QuestionnaireAlreadyOnCareplan extends BaseServiceError {
    displayMessage() {
        return "Spørgeskema allerede på monitoreringsplan";
    }
}