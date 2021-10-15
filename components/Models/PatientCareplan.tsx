import { PatientDetail } from "./PatientDetail";
import { PlanDefinition } from "./PlanDefinition";
import { Questionnaire } from "./Questionnaire";
import { QuestionnaireResponse } from "./QuestionnaireResponse";
import { Threshold } from "./Threshold";


export class PatientCareplan {
    planDefinitions : Array<PlanDefinition> = [];
    questionnaires : Questionnaire[] = []
    patient! : PatientDetail
}
