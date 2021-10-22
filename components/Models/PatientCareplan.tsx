import { PatientDetail } from "./PatientDetail";
import { PlanDefinition } from "./PlanDefinition";
import { Questionnaire } from "./Questionnaire";
import { QuestionnaireResponse } from "./QuestionnaireResponse";


export class PatientCareplan {
    id! : string;
    planDefinitions : Array<PlanDefinition> = [];
    questionnaires : Questionnaire[] = []
    patient! : PatientDetail
    creationDate! : Date;
    terminationDate! : Date;
    department!: string;
}
