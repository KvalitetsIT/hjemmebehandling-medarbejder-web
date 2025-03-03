import { CategoryEnum } from "./CategoryEnum";
import { EnableWhen } from "./EnableWhen";
import { MeasurementType } from "./MeasurementType";

export class BaseQuestion {
    Id?: string
    type?: QuestionTypeEnum
}

export type Option = { option: string, comment: string, triage: CategoryEnum }

export class Question extends BaseQuestion {
    question?: string
    options?: Array<Option>;
    helperText?: string
    abbreviation?: string
    enableWhen?: EnableWhen<boolean>
    measurementType?: MeasurementType
    deprecated?: boolean 
    subQuestions?: Array<Question>
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
    CALLTOACTION = "CALLTOACTION",
    GROUP = "GROUP"
}