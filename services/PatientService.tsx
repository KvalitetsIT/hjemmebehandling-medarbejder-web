

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { Question } from "../components/Models/Question";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import BaseService from "./BaseService";
import ICareplanService from "./interfaces/ICareplanService";
import IPatientService from "./interfaces/IPatientService";
import IQuestionAnswerService from "./interfaces/IQuestionAnswerService";
import IQuestionnaireService from "./interfaces/IQuestionnaireService";

export default class PatientService extends BaseService implements IPatientService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }
    async EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        try{
        return await this.backendApi.EditPatient(patient);
    } catch(error : any){
        return this.HandleError(error);
      }
    }
    async SearchPatient(searchString: string) : Promise<PatientDetail[]>{
        try{
        return await this.backendApi.SearchPatient(searchString);
    } catch(error : any){
        return this.HandleError(error);
      }
    }
    
    async CreatePatient(patient : PatientDetail) : Promise<PatientDetail>{
        try{
        return await this.backendApi.CreatePatient(patient);
    } catch(error : any){
        return this.HandleError(error);
      }
    }

    async GetPatient(cpr: string) : Promise<PatientDetail>{
        try{
        return await this.backendApi.GetPatient(cpr);
    } catch(error : any){
        return this.HandleError(error);
      }
    }

    async GetPatients(includeActive : boolean, page : number, pageSize : number) : Promise<PatientDetail[]>{
      try{
        this.ValidatePagination(page,pageSize);
        return await this.backendApi.GetPatients(includeActive,page,pageSize)
    } catch(error : any){
        return this.HandleError(error);
      }
    }
    
    
}
  