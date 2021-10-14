import { PlanDefinition } from "./PlanDefinition";
import { Questionnaire } from "./Questionnaire";
import { Threshold } from "./Threshold";


export class PatientCareplan {
    planDefinitions : Array<PlanDefinition> = [];
    questionnaires : Array<Questionnaire> = [];
}
