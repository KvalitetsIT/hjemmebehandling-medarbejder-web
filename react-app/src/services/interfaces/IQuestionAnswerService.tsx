import { Answer } from "../../components/Models/Answer"
import { CategoryEnum } from "../../components/Models/CategoryEnum"
import { MeasurementType } from "../../components/Models/MeasurementType"
import { ThresholdCollection } from "../../components/Models/ThresholdCollection"



/**
 * QuestionAnswerService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from ../Models
 */
export interface IQuestionAnswerService {
     /**
      * Finds the answers risk-value (category)
      */
     FindCategory : (thresholdCollection : ThresholdCollection, answer: Answer<any>) => CategoryEnum

     /**
      * @returns all meaasurementtypes
      */
     GetAllMeasurementTypes(): Promise<MeasurementType[]> 
}
  