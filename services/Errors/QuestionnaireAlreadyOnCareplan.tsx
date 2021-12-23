import {BaseServiceError} from '@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError'

export class QuestionnaireAlreadyOnCareplan extends BaseServiceError {
    displayMessage() {
        return "Spørgeskema allerede på monitoreringsplan";
    }
}