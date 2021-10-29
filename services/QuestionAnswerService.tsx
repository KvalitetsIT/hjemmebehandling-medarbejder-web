

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Question } from "../components/Models/Question";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import IQuestionAnswerService from "./interfaces/IQuestionAnswerService";
import IQuestionnaireService from "./interfaces/IQuestionnaireService";

export default class QuestionAnswerService implements IQuestionAnswerService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        this.backendApi = backendApi;
    }
    SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber) : Promise<void>{
        return this.backendApi.SetThresholdNumber(thresholdId,threshold);
    };
    SetThresholdOption(thresholdId: string, threshold: ThresholdOption) : Promise<void>{
        return this.backendApi.SetThresholdOption(thresholdId,threshold);
    };
    
    
}
  