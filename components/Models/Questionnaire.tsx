import { Frequency } from "./Frequency";
import { QuestionnaireResponse } from "./QuestionnaireResponse";

export class Questionnaire {
    name: string;
    frequency!: Frequency;

    constructor(name : string){
        this.name = name;
    }
}