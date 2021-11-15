

import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Question } from "../components/Models/Question";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import BaseService from "./BaseService";
import IQuestionAnswerService from "./interfaces/IQuestionAnswerService";

export default class QuestionAnswerService extends BaseService implements IQuestionAnswerService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }
    SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber) : Promise<void>{
        return this.backendApi.SetThresholdNumber(thresholdId,threshold);
    };
    SetThresholdOption(thresholdId: string, threshold: ThresholdOption) : Promise<void>{
        return this.backendApi.SetThresholdOption(thresholdId,threshold);
    };

    FindCategory(question: Question, answer: Answer) : CategoryEnum {
        
        if(answer instanceof NumberAnswer){
            let answerAsNumber = answer as NumberAnswer;
            let thresholdPoint = question.thresholdPoint.find(x=>x.from <= answerAsNumber.answer && answerAsNumber.answer <= x.to);
            return thresholdPoint ? thresholdPoint.category : CategoryEnum.GREEN;
        }
        if(answer instanceof StringAnswer){
            let answerAsString = answer as StringAnswer;
            let thresholdPoint = question.options.find(x=>x.option == answerAsString.answer);
            return thresholdPoint ? thresholdPoint.category : CategoryEnum.GREEN;
        }
    
        return CategoryEnum.GREEN
    }
    
    
}
  