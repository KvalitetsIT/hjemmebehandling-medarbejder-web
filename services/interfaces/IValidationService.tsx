import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";

/**
 * ValidationService 
 * - Should contain all validation-methods used in fx input-validation
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IValidationService {
    ValidateCPR : (cpr : string) => Promise<InvalidInputModel[]>
    ValidatePhonenumber : (phoneNumber : string) => Promise<InvalidInputModel[]>
    ValidatePlanDefinitions : (planDefinitions : PlanDefinition[]) => Promise<InvalidInputModel[]>
    ValidateZipCode : (zipCode : string) => Promise<InvalidInputModel[]>;
}
  