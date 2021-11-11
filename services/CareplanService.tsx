

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { Question } from "../components/Models/Question";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import ICareplanService from "./interfaces/ICareplanService";
import IQuestionAnswerService from "./interfaces/IQuestionAnswerService";
import IQuestionnaireService from "./interfaces/IQuestionnaireService";

export default class CareplanService implements ICareplanService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        this.backendApi = backendApi;
    }

    async CreateCarePlan(carePlan: PatientCareplan) : Promise<PatientCareplan> {
        return this.backendApi.CreateCarePlan(carePlan)
    }

    TerminateCareplan(careplan: PatientCareplan) : Promise<PatientCareplan>{
        return this.backendApi.TerminateCareplan(careplan);
    }
    
    SetPlanDefinitionsOnCareplan(careplan: PatientCareplan) : Promise<PatientCareplan>{

        let careplanOnlyChangedValues = new PatientCareplan();
        careplanOnlyChangedValues.id = careplan.id;
        careplanOnlyChangedValues.planDefinitions = careplan.planDefinitions
        return this.backendApi.SetCareplan(careplanOnlyChangedValues);
    }

    GetPatientCareplans(cpr: string) : Promise<Array<PatientCareplan>>{
        return this.backendApi.GetPatientCareplans(cpr);
    }
    
    
}
  