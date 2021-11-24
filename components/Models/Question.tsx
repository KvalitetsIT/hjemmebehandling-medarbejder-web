import { IComparable } from "./Interfaces/IComparable";

export class Question implements IComparable<Question>{
    isEqual(other: Question) : boolean{
        return this.question === other.question;
    }
    Id! : string
    question! : string
    type! : QuestionTypeEnum
}

export enum QuestionTypeEnum{
    CHOICE = 'CHOICE',
    INTEGER = 'INTEGER',
    OBSERVATION = 'Måling', // Måling/Observation etc!
    STRING = 'STRING'
}