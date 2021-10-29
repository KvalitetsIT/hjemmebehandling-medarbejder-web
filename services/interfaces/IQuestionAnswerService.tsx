import React from "react";
import { ThresholdNumber } from "../../components/Models/ThresholdNumber";
import { ThresholdOption } from "../../components/Models/ThresholdOption";



export default interface QuestionAnswerService {
    
    /**
     * Set the value of threshold number
     */
     SetThresholdNumber : (thresholdId : string, threshold : ThresholdNumber) => Promise<void>

     /**
      * Set the value of threshold option
      */
     SetThresholdOption : (thresholdId : string, threshold : ThresholdOption) => Promise<void>
}
  