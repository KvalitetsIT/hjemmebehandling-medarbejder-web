import React from "react";
import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";



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
     FindCategory : (thresholdCollection : ThresholdCollection, answer: Answer) => CategoryEnum
}
  