import { Questionnaire } from "./Questionnaire";


export class PlanDefinition {
    id! : string;
    name! : string;
    questionnaires! : Questionnaire[]
}
