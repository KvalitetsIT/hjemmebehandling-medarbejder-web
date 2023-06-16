import { EnableWhen } from "./EnableWhen";
import { IComparable } from "./Interfaces/IComparable";
import { MeasurementType } from "./MeasurementType";

export class BaseQuestion implements IComparable<Question>{
    isEqual(other: Question): boolean {
        return this.Id === other.Id;
    }
    Id?: string
    type?: QuestionTypeEnum

}

export class Question extends BaseQuestion {
    question?: string
    options?: Array<string>;
    helperText?: string
    abbreviation?: string
    enableWhen?: EnableWhen<boolean>
    measurementType?: MeasurementType
    deprecated?: boolean 
}

export class CallToActionQuestion extends BaseQuestion {
    constructor() {
        super()
        this.type = QuestionTypeEnum.CALLTOACTION
    }

    enableWhens?: EnableWhen<boolean>[];
    message?: string
}

export enum QuestionTypeEnum {
    CHOICE = 'CHOICE',
    BOOLEAN = 'BOOLEAN',
    INTEGER = 'INTEGER',
    OBSERVATION = 'Måling', // Måling/Observation etc!
    STRING = 'STRING',
    CALLTOACTION = "CALLTOACTION"
}