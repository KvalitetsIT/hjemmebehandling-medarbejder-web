

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
    EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        return this.backendApi.EditPatient(patient);
    }
    SearchPatient(searchString: string) : Promise<PatientDetail[]>{
        return this.backendApi.SearchPatient(searchString);
    }
    
    CreatePatient(patient : PatientDetail) : Promise<PatientDetail>{
        return this.backendApi.CreatePatient(patient);
    }

    GetPatient(cpr: string) : Promise<PatientDetail>{
        return this.backendApi.GetPatient(cpr);
    }
    
    
}
  