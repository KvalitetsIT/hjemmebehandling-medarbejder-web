///////// Model ///////////
interface ThresholdNumber {
    id: string
    category: CategoryEnum
    from?: number
    to?: number
}

interface MeasurementType {
    displayName?: string;
    system?: string;
    code?: string;
    threshold?: ThresholdNumber;
}
type Option = { option: string, comment: string, triage: CategoryEnum }

interface EnableWhen<T> {
    questionId?: string
    answer?: T
    operator?: string

}
interface Question {
    question?: string,
    options?: Array<Option>;
    helperText?: string
    abbreviation?: string
    enableWhen?: EnableWhen<boolean>
    measurementType?: MeasurementType
    deprecated?: boolean
    subQuestions?: Array<Question>
}

interface QuestionEditor extends FormProps<Question> {
    loading?: boolean
    question: Question
}