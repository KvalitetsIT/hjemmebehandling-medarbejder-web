import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";

///////// Model ///////////
export interface ThresholdNumber {
    id: string
    category: CategoryEnum
    from?: number
    to?: number
}

export interface MeasurementType {
    displayName?: string;
    system?: string;
    code?: string;
    threshold?: ThresholdNumber;
}
export type Option = { option: string, comment: string, triage: CategoryEnum }

export interface EnableWhen<T> {
    questionId?: string
    answer?: T
    operator?: string

}
export interface Question {
    Id?: string
    type?: QuestionTypeEnum
    question?: string,
    options?: Array<Option>;
    helperText?: string
    abbreviation?: string
    enableWhen?: EnableWhen<boolean>
    measurementType?: MeasurementType
    deprecated?: boolean
    subQuestions?: Array<Question>
}

export interface Questionnaire {
    id?: string
    status: BaseModelStatus
    name?: string
    questions?: Question[]
}

