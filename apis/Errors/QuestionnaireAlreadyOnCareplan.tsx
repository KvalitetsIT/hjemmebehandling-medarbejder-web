
export class QuestionnaireAlreadyOnCareplan extends Error {
    displayMessage() {
        return "Spørgeskema allerede på monitoreringsplan";
    }
}