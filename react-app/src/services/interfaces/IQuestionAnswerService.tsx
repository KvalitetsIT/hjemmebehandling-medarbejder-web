import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";


/**
 * QuestionAnswerService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
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
  