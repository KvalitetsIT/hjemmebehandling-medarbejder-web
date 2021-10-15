import { Frequency } from "./Frequency";
import { QuestionnaireResponse } from "./QuestionnaireResponse";
import { Threshold } from "./Threshold";

export class Questionnaire {
    id! : string;
    name!: string;
    frequency!: Frequency;
    thresholds : Threshold[] = []
    questionnaireResponses : QuestionnaireResponse[] = []
}