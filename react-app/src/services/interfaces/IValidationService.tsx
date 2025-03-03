import { InvalidInputModel } from "../../components/Errorhandling/ServiceErrors/InvalidInputError";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { Questionnaire } from "../../components/Models/Questionnaire";


/**
 * ValidationService 
 * - Should contain all validation-methods used in fx input-validation
 * - should only use domain-models from ../Models
 * - Methods should always return InvalidInputModel, representing the things that are wrong with the input
 */
export interface IValidationService {
    /**
     * Validates CPR
     * @param cpr to validate
     * @returns List of errors
     */
    ValidateCPR : (cpr : string) => Promise<InvalidInputModel[]>

    /**
     * Validate phonenumber
     * @param phoneNumber to validate
     * @returns List of errors
     */
    ValidatePhonenumber : (phoneNumber : string) => Promise<InvalidInputModel[]>

    /**
     * Validate a plandefinition
     * @param planDefinitions to validate
     * @returns List of errors
     */
    ValidatePlanDefinitions : (planDefinitions : PlanDefinition[]) => Promise<InvalidInputModel[]>

    /**
     * ValidateZipCode
     * @param zipCode to validate
     * @returns List of errors
     */
    ValidateZipCode : (zipCode : string) => Promise<InvalidInputModel[]>;


    /**
     * Validate a list questionnaires
     * @param questionnaires to validate
     * @returns List of errors
     */
    ValidateQuestionnaires : (questionnaires: Questionnaire[]) => Promise<InvalidInputModel[]>

}
  