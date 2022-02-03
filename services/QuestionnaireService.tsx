import { IBackendApi } from "../apis/interfaces/IBackendApi";
import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import { IQuestionnaireService } from "./interfaces/IQuestionnaireService";

export default class QuestionnaireService extends BaseService implements IQuestionnaireService {
  backendApi: IBackendApi;

  constructor(backendapi: IBackendApi) {
    super();
    this.backendApi = backendapi;
  }
  
  async getQuestionnaire(questionnaireId: string) :  Promise<Questionnaire | undefined>{
    try{
      return await this.backendApi.GetQuestionnaire(questionnaireId);
    }catch(error){
      return this.HandleError(error);
    }
  }

  async IsPatientOnUnanswered(cpr: string): Promise<boolean> {
    try {
      return await this.backendApi.IsPatientOnUnanswered(cpr);
    } catch (error) {
      return this.HandleError(error);
    }
  }

  async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number): Promise<QuestionnaireResponse[]> {
    try {
      this.ValidatePagination(page, pagesize);
      let toReturn = await this.backendApi.GetQuestionnaireResponses(careplanId, questionnaireIds, page, pagesize);
      toReturn = toReturn.filter(x => x !== undefined)
      toReturn.sort((a, b) => {
        if (b.answeredTime && a.answeredTime)
          return b.answeredTime.getTime() - a.answeredTime.getTime();
        return -1;
      })
      return toReturn;
    } catch (error: unknown) {
      return this.HandleError(error);
    }
  }

  async AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
    try {
      return await this.backendApi.AddQuestionnaireToCareplan(careplan, questionnaireToAdd);
    } catch (error: unknown) {
      return this.HandleError(error);
    }
  }

  async GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
    try {
      return await this.backendApi.GetAllPlanDefinitions();
    } catch (error: unknown) {
      return this.HandleError(error);
    }
  }

  async GetUnfinishedQuestionnaireResponseTasks(page: number, pagesize: number): Promise<Array<Task>> {
    try {
      this.ValidatePagination(page, pagesize);
      const apiResult = await this.backendApi.GetUnfinishedQuestionnaireResponseTasks(page, pagesize)
      return apiResult.sort((a, b) => b.category - a.category)
    } catch (error: unknown) {
      return this.HandleError(error);
    }
  }

  async GetUnansweredQuestionnaireTasks(page: number, pagesize: number): Promise<Array<Task>> {
    try {
      this.ValidatePagination(page, pagesize);
      return await this.backendApi.GetUnansweredQuestionnaireTasks(page, pagesize)
    } catch (error: unknown) {
      return this.HandleError(error);
    }

  }

  async RemoveAlarm(task: Task): Promise<void> {
    try {
      return await this.backendApi.RemoveAlarm(task);
    } catch (error: unknown) {
      return this.HandleError(error);
    }
  }

  async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus): Promise<QuestionnaireResponseStatus> {
    try {
      return await this.backendApi.UpdateQuestionnaireResponseStatus(id, status)
    } catch (error: unknown) {
      return this.HandleError(error);
    }
  }

  findAnswer(desiredQuestion: Question, questionResponses: QuestionnaireResponse): Answer | undefined {
    let answer: Answer | undefined;
    questionResponses.questions!.forEach((responseAnswer, responseQuestion) => {
      if (responseQuestion.isEqual(desiredQuestion)) {
        answer = responseAnswer;
        return; //Return out of foreach-function
      }
    });
    return answer;
  }

  findAllQuestions(questionResponses: Array<QuestionnaireResponse | undefined>): Question[] {
    const questions: Question[] = [];
    questionResponses.filter(x => x != undefined).forEach(singleResponse => {
      const iterator = singleResponse!.questions!.entries();
      let element = iterator.next();
      while (!element.done) {

        const candidate = element.value[0];
        const questionAlreadyExists = questions.some(q => q.isEqual(candidate))

        if (!questionAlreadyExists) {
          questions.push(candidate)
        }
        element = iterator.next()
      }

    });
    return questions;
  }
}

