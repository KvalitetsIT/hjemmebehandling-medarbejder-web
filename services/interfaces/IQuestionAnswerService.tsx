import React from "react";
import { Answer } from "../../components/Models/Answer";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { Question } from "../../components/Models/Question";
import { ThresholdNumber } from "../../components/Models/ThresholdNumber";
import { ThresholdOption } from "../../components/Models/ThresholdOption";



export default interface IQuestionAnswerService {
    
    /**
     * Set the value of threshold number
     */
     SetThresholdNumber : (thresholdId : string, threshold : ThresholdNumber) => Promise<void>

     /**
      * Set the value of threshold option
      */
     SetThresholdOption : (thresholdId : string, threshold : ThresholdOption) => Promise<void>

     /**
      * Finds the answers risk-value (category)
      */
     FindCategory : (question: Question, answer: Answer) => CategoryEnum
}
  