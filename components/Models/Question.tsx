import { IComparable } from "./Interfaces/IComparable";
import { ThresholdNumber } from "./ThresholdNumber";
import { ThresholdOption } from "./ThresholdOption";

export class Question implements IComparable<Question>{
    isEqual(other: Question) : boolean{
        return this.question === other.question;
    }
    
    question! : string
    type! : QuestionTypeEnum
    options : ThresholdOption[] = []
    thresholdPoint : ThresholdNumber[] = []
}

export enum QuestionTypeEnum{
    CHOICE = 'CHOICE',
    INTEGER = 'INTEGER',
    OBSERVATION = 'Måling', // Måling/Observation etc!
    STRING = 'STRING'
}