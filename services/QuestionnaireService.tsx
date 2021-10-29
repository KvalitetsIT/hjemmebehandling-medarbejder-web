import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import IQuestionnaireService from "./interfaces/IQuestionnaireService";

export default class QuestionnaireService implements IQuestionnaireService {
    backendApi : IBackendApi;

    constructor(backendapi : IBackendApi){
        this.backendApi = backendapi;
    }
    GetTasklist(categories: CategoryEnum[], page: number, pagesize: number) : Promise<Questionnaire[]>{
        return this.backendApi.GetTasklist(categories,page,pagesize);
    }
    SetQuestionaireResponse (id : string, questionnaireResponses : QuestionnaireResponse) : Promise<void>{
        return this.backendApi.SetQuestionaireResponse(id,questionnaireResponses)
    }
    
    findAnswer(desiredQuestion : Question, questionResponses : QuestionnaireResponse) : Answer | undefined {
        let answer : Answer | undefined;
        questionResponses.questions.forEach( (responseAnswer,responseQuestion) => {
            if(responseQuestion.isEqual(desiredQuestion)){
                answer = responseAnswer;
                return; //Return out of foreach-function
            }
        });
        return answer;
    }

    findAllQuestions(questionResponses : Array<QuestionnaireResponse>) : Question[]{
        let questions : Question[] = [];
        questionResponses.forEach(singleResponse => {
            let iterator = singleResponse.questions.entries();
            let element = iterator.next();
            while(!element.done){
                
                let candidate = element.value[0];
                let questionAlreadyExists = questions.some(q => q.isEqual(candidate))
    
                if(!questionAlreadyExists){
                    questions.push(candidate)
                }
                element = iterator.next()
            }
    
        });
        return questions;
    }
    
}
  