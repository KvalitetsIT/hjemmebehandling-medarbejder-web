import { CategoryEnum } from "./CategoryEnum";
import { Patient } from "./Patient";
import { Questionnaire } from "./Questionnaire";

export class QuestionnaireResponse {
    answeredTime!: Date;
    category! : CategoryEnum;
    questionnaire!: Questionnaire;
    patient! : Patient
    
}