import { CategoryEnum } from "./CategoryEnum";
import { PatientSimple } from "./PatientSimple";
import { Questionnaire } from "./Questionnaire";

export class QuestionnaireResponse {
    answeredTime!: Date;
    category! : CategoryEnum;
    questionnaire!: Questionnaire;
    patient! : PatientSimple
    
}