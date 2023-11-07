import { IBackendApi } from "../apis/interfaces/IBackendApi";
import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import { IQuestionnaireService } from "./interfaces/IQuestionnaireService";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import {PaginatedList} from "@kvalitetsit/hjemmebehandling/Models/PaginatedList";



export default class QuestionnaireService extends BaseService implements IQuestionnaireService {
  backendApi: IBackendApi;
  questionnaireFiltering: QuestionnaireFiltering

  constructor(backendapi: IBackendApi) {
    super();
    this.backendApi = backendapi;
    this.questionnaireFiltering = new QuestionnaireFiltering();
  }

  async IsQuestionnaireInUse(questionnaireId: string): Promise<boolean> {
    console.log("ID:", questionnaireId)
    try{
      return await this.backendApi.IsQuestionnaireInUse(questionnaireId);
    }catch(error){
      return this.HandleError(error)
    }
  }
  async createQuestionnaire(questionnaire: Questionnaire): Promise<void> {
    try {
      questionnaire.questions = this.questionnaireFiltering.removeOrphans(questionnaire.questions!);
      await this.backendApi.createQuestionnaire(questionnaire);
    } catch (error) {
      return this.HandleError(error);
    }
  }

  async GetAllQuestionnaires(statusesToInclude: (QuestionnaireStatus | BaseModelStatus)[]): Promise<Questionnaire[]> {
    try {
      return await this.backendApi.GetAllQuestionnaires(statusesToInclude);
    } catch (error) {
      return this.HandleError(error)
    }
  }

  async updateQuestionnaire(questionnaire: Questionnaire): Promise<void> {
    try {
      questionnaire.questions = this.questionnaireFiltering.removeOrphans(questionnaire.questions!);
      await this.backendApi.updateQuestionnaire(questionnaire);
    } catch (error) {
      return this.HandleError(error);
    }
  }

  async retireQuestionnaire(questionnaire: Questionnaire): Promise<void> {
    try {
      await this.backendApi.retireQuestionnaire(questionnaire);
    } catch (error) {
      return this.HandleError(error);
    }
  }

  async getQuestionnaire(questionnaireId: string): Promise<Questionnaire | undefined> {
    try {
      return await this.backendApi.GetQuestionnaire(questionnaireId);
    } catch (error) {
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

  async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number): Promise<PaginatedList<QuestionnaireResponse>> {
    try {
      this.ValidatePagination(page, pagesize);
      let response = await this.backendApi.GetQuestionnaireResponses(careplanId, questionnaireIds, page, pagesize);
      
  
      let list = response.list.filter(x => x !== undefined)
      list.sort((a, b) => {
        if (b.answeredTime && a.answeredTime)
          return b.answeredTime.getTime() - a.answeredTime.getTime();
        return -1;
      })

      return {
        ...response,
        list: list
      };

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

  async GetUnfinishedQuestionnaireResponseTasks(page: number, pagesize: number): Promise<Array<Task>> {
    try {
      this.ValidatePagination(page, pagesize);
      const apiResult = await this.backendApi.GetUnfinishedQuestionnaireResponseTasks(page, pagesize)
      return apiResult.sort((a, b) => b.category - a.category )
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
    questionResponses.filter(x => x !== undefined).forEach(singleResponse => {
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

  GetThresholds(questionnaire: Questionnaire, question: Question): ThresholdCollection {
    if (questionnaire && !questionnaire.thresholds)
      questionnaire.thresholds = []

    let thresholdCollection = questionnaire?.thresholds?.find(x => x.questionId === question.Id);

    if (thresholdCollection) return thresholdCollection;
    
    thresholdCollection = new ThresholdCollection();
    thresholdCollection.questionId = question.Id!;
    questionnaire?.thresholds?.push(thresholdCollection);

    const trueOption = new ThresholdOption();
    trueOption.option = true.toString();
    const falseOption = new ThresholdOption();
    falseOption.option = false.toString();
    thresholdCollection.thresholdOptions = [trueOption, falseOption];


    return thresholdCollection;

  }


  RemoveQuestion(questionnaire: Questionnaire, questionToRemove: Question): Questionnaire {
    if (!questionnaire?.questions)
      return questionnaire;

    const indexOfElementToRemove = questionnaire.questions.findIndex(q => q.Id === questionToRemove.Id)
    if (indexOfElementToRemove > -1)
      questionnaire.questions.splice(indexOfElementToRemove, 1);

    const callToActions =questionnaire.getCallToActions()[0];
    const newEnableWhens = callToActions.enableWhens?.filter(ew => ew.questionId !== questionToRemove.Id);
    callToActions.enableWhens = newEnableWhens;

    return questionnaire;
  }

  MoveQuestion(questionnaire: Questionnaire, question: Question, step: number): Questionnaire {

    const questionToMoveIsParent = question.enableWhen?.questionId === undefined
    if (!questionnaire)
      return questionnaire;

    const oldQuestions: Question[] = questionnaire.questions!.filter(q => q instanceof Question);
    if (!oldQuestions)
      return questionnaire;

    const fromPosition = oldQuestions.findIndex(q => q.Id === question.Id)

    let toPosition = -1;
    if (step < 0) {
      // moving up
      for (let i = fromPosition+step; i >= 0; i--) {
        console.log(i)
        const nextIsParent = oldQuestions[i].enableWhen?.questionId === undefined
        if ((questionToMoveIsParent && nextIsParent) || (!questionToMoveIsParent && !nextIsParent)) {
          toPosition = i;
          break;
        }
      }
      //console.log("moving up", fromPosition, toPosition);
    }
    else {
      // moving down
      for (let i = fromPosition+step; i < oldQuestions.length; i++) {
        const nextIsParent = oldQuestions[i].enableWhen?.questionId === undefined
        if ((questionToMoveIsParent && nextIsParent) || (!questionToMoveIsParent && !nextIsParent)) {
          toPosition = i;
          break;
        }
      }
      //console.log("moving down", fromPosition, toPosition);
    }

    if (toPosition === -1)
      return questionnaire;

    const fromPositionItem = oldQuestions[fromPosition];
    const toPositionItem = oldQuestions[toPosition];
    if (!fromPositionItem || !toPositionItem)
      return questionnaire;

    const newQuestions = oldQuestions;
    newQuestions[fromPosition] = toPositionItem;
    newQuestions[toPosition] = fromPositionItem;
    newQuestions.push(...questionnaire.getCallToActions());

    const afterQuestionnaire = questionnaire;
    afterQuestionnaire.questions = newQuestions;
    
    return afterQuestionnaire;
    
  }
}



export class QuestionnaireFiltering {
  removeOrphans(questions: Question[]): Question[] {
    const newQuestions: Question[] = [];

    for (let i = 0; i < questions.length; i++) {
      const candidate = questions[i];
      const candidateEnableWhen = candidate.enableWhen

      //Questions with no parent should always get through
      const hasNoParent = candidateEnableWhen === undefined
      if (hasNoParent)
        newQuestions.push(candidate);

      //If question has enableWhen, it is a childquestion
      //Now we need to figure out if the parent is in list, and that the parent is supported to have children
      //Right now it is only the boolean-type that can have children
      const parentExists = questions.find(q => q.Id === candidateEnableWhen?.questionId);
      const acceptableTypes = [QuestionTypeEnum.BOOLEAN]
      const parentIsSupportedToHaveChildren = acceptableTypes.some(at => parentExists?.type === at)
      if (parentExists && parentIsSupportedToHaveChildren)
        newQuestions.push(candidate)
    }

    return newQuestions;
  }

}

