

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Person } from "../components/Models/Person";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { UserContext } from "../generated";
import { PersonDto } from "../generated/models/PersonDto";
import BaseService from "./BaseService";
import { InvalidInputModel } from "./Errors/InvalidInputError";
import IPersonService from "./interfaces/IPersonService";
import IUserService from "./interfaces/IUserService";
import IValidationService from "./interfaces/IValidationService";

export default class ValidationService extends BaseService implements IValidationService {
    async ValidateZipCode(zipCode: string): Promise<InvalidInputModel[]>{
        const erorrs : InvalidInputModel[] = []
        let propName = "Postnummer"
        if(zipCode.length !== 4){
            const error = new InvalidInputModel(propName,"Skal være 4 tegn")
            erorrs.push(error)
        }
        return erorrs;
    }

    async ValidateCPR(cpr: string) : Promise<InvalidInputModel[]>{
        const erorrs : InvalidInputModel[] = []
        let propName = "CPR"
    
        if(!cpr){
            const error = new InvalidInputModel(propName,"ikke udfyldt")
            erorrs.push(error)
        }
            
        if(cpr && cpr?.length != 10){
            const error = new InvalidInputModel(propName,"skal være 10 tegn")
            erorrs.push(error)
        }
        return erorrs;
    }

    async ValidatePhonenumber(phoneNumber: string) : Promise<InvalidInputModel[]>{
        const errors : InvalidInputModel[] = []   
        let propName = "Telefonnummer"
        if(!phoneNumber || phoneNumber === "")
            return [];

        if(!phoneNumber.includes("+")){
            const error = new InvalidInputModel(propName,"Telefonnummer skal indeholde landekode")
            errors.push(error)
        }

        if(phoneNumber.length != 11){
            const error = new InvalidInputModel(propName,"Telefonnummer skal være 11 karakter (inkl landekode)")
            errors.push(error)
        }

        return errors;
    }

    async ValidatePlanDefinitions(planDefinitions: PlanDefinition[]) : Promise<InvalidInputModel[]>{
        const errors : InvalidInputModel[] = []   
        let propName = "Patientgruppe"

        if(!planDefinitions || planDefinitions.length == 0){
            const error = new InvalidInputModel(propName,"Patient skal knyttes til minimum én patientgruppe ")
            errors.push(error)
        }

        return errors
    }


}
  