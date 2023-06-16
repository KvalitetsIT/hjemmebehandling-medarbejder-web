import { Answer, BooleanAnswer } from "./Answer"

/**
 * EnableWhen-object represents a predicate
 * So when the predicate is true the question will be shown
 */
 export class EnableWhen<T> {

    /**
     * Id of the question to look at
     */
    questionId?: string
    
    /**
     * The value of the answer to be compared
     */
    answer?: T 
    
    /**
     * The operator to compare the answer with
     */
    operator?: string

    ShouldBeEnabled(actualAnswerValue : T) : boolean{
        //TODO: Use operator
        return actualAnswerValue == this.answer
    }
}