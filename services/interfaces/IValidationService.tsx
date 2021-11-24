import React from "react";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { InvalidInputModel } from "../Errors/InvalidInputError";

export default interface IValidationService {
    ValidateCPR : (cpr : string) => Promise<InvalidInputModel[]>
    ValidatePhonenumber : (phoneNumber : string) => Promise<InvalidInputModel[]>
    ValidatePlanDefinitions : (planDefinitions : PlanDefinition[]) => Promise<InvalidInputModel[]>
    ValidateZipCode : (zipCode : string) => Promise<InvalidInputModel[]>;
}
  