import { BaseApiError } from "./BaseApiError";

export class QuestionnaireAlreadyOnCareplan extends Error implements BaseApiError {
    displayMessage() {
        return "Spørgeskema allerede på monitoreringsplan";
    }
}