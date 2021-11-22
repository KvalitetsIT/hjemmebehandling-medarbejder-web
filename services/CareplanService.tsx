

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { Question } from "../components/Models/Question";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import BaseService from "./BaseService";
import ICareplanService from "./interfaces/ICareplanService";
import IQuestionAnswerService from "./interfaces/IQuestionAnswerService";
import IQuestionnaireService from "./interfaces/IQuestionnaireService";

export default class CareplanService extends BaseService implements ICareplanService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }

    async CreateCarePlan(carePlan: PatientCareplan) : Promise<PatientCareplan> {
        try{
        return await this.backendApi.CreateCarePlan(carePlan)
    } catch(error : any){
        return this.HandleError(error);
      }
    }

    async TerminateCareplan(careplan: PatientCareplan) : Promise<PatientCareplan>{
        try{
        return await this.backendApi.TerminateCareplan(careplan);
    } catch(error : any){
        return this.HandleError(error);
      }
    }
    
    async SetPlanDefinitionsOnCareplan(careplan: PatientCareplan) : Promise<PatientCareplan>{
        try{

        let careplanOnlyChangedValues = new PatientCareplan();
        careplanOnlyChangedValues.id = careplan.id;
        careplanOnlyChangedValues.planDefinitions = careplan.planDefinitions
        return await this.backendApi.SetCareplan(careplanOnlyChangedValues);
    } catch(error : any){
        return this.HandleError(error);
      }
    }

    async GetPatientCareplans(cpr: string) : Promise<Array<PatientCareplan>>{
        try{
        return await this.backendApi.GetPatientCareplans(cpr);
    } catch(error : any){
        return this.HandleError(error);
      }
    }
    
    
}
  