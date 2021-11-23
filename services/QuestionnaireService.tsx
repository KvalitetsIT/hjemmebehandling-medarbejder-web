import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { Task } from "../components/Models/Task";
import BaseService from "./BaseService";
import { InvalidInputError, InvalidInputModel } from "./Errors/InvalidInputError";
import IQuestionnaireService from "./interfaces/IQuestionnaireService";

export default class QuestionnaireService extends BaseService implements IQuestionnaireService {
    backendApi : IBackendApi;

    constructor(backendapi : IBackendApi){
      super();
      this.backendApi = backendapi;
    }

  async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number) : Promise<QuestionnaireResponse[]>{
    try{
    this.ValidatePagination(page,pagesize);
    return await this.backendApi.GetQuestionnaireResponses(careplanId,questionnaireIds,page,pagesize);
  } catch(error : any){
    return this.HandleError(error);
  }
  }

  async SetQuestionnaireFrequency(questionnaire: Questionnaire) : Promise<void>{
      try{
        let questionnaireEdit = new Questionnaire();
        questionnaireEdit.id = questionnaire.id;
        questionnaireEdit.frequency = questionnaire.frequency
        return await this.backendApi.SetQuestionnaire(questionnaireEdit)
      } catch(error : any){
        return this.HandleError(error);
      }
    }

    async AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire) : Promise<PatientCareplan>{
      try{
        return await this.backendApi.AddQuestionnaireToCareplan(careplan,questionnaireToAdd);
      } catch(error : any){
        return this.HandleError(error);
      }
    }

    async GetAllPlanDefinitions() : Promise<PlanDefinition[]>{
      try{
        return await this.backendApi.GetAllPlanDefinitions();
      } catch(error : any){
        return this.HandleError(error);
      }
    }

    async  GetUnfinishedQuestionnaireResponseTasks(page : number, pagesize : number) : Promise<Array<Task>> {
      try{
      this.ValidatePagination(page,pagesize);
        return await this.backendApi.GetUnfinishedQuestionnaireResponseTasks(page, pagesize)
      } catch(error : any){
        return this.HandleError(error);
      }
    }

    async GetUnansweredQuestionnaireTasks(page : number, pagesize : number) : Promise<Array<Task>> {
      try{
        this.ValidatePagination(page,pagesize);
        return await this.backendApi.GetUnansweredQuestionnaireTasks(page, pagesize)
      } catch(error : any){
        return this.HandleError(error);
      }
      
    }

    async RemoveAlarm(task : Task) : Promise<void> {
      try{
        return await this.backendApi.RemoveAlarm(task);
      } catch(error : any){
        return this.HandleError(error);
      }
    }

    async SetQuestionaireResponse (id : string, questionnaireResponses : QuestionnaireResponse) : Promise<void>{
      try{
        return await this.backendApi.SetQuestionaireResponse(id,questionnaireResponses)
      } catch(error : any){
        return this.HandleError(error);
      }
    }

    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus) : Promise<void> {
      try{
        return await this.backendApi.UpdateQuestionnaireResponseStatus(id, status)
      } catch(error : any){
        return this.HandleError(error);
      }
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
  
