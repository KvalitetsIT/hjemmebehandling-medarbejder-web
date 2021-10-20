import { Frequency } from "./Frequency";
import { QuestionnaireResponse } from "./QuestionnaireResponse";

export class Questionnaire {
    id! : string;
    name!: string;
    frequency!: Frequency;
    questionnaireResponses : QuestionnaireResponse[] = []
}