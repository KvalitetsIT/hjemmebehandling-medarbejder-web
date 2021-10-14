import { Frequency } from "./Frequency";
import { QuestionnaireResponse } from "./QuestionnaireResponse";
import { Threshold } from "./Threshold";

export class Questionnaire {
    name!: string;
    frequency!: Frequency;
    thresholds : Threshold[] = []

}