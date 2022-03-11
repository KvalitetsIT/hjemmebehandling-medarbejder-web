import { IBackendApi } from "../apis/interfaces/IBackendApi";
import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { BaseQuestion, Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import { IQuestionnaireService } from "./interfaces/IQuestionnaireService";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";



export default class QuestionnaireService extends BaseService implements IQuestionnaireService {
  backendApi: IBackendApi;
  questionnaireFiltering: QuestionnaireFiltering

  constructor(backendapi: IBackendApi) {
    super();
    this.backendApi = backendapi;
    this.questionnaireFiltering = new QuestionnaireFiltering();
  }
  async createQuestionnaire(questionnaire: Questionnaire): Promise<void> {
    try {
      questionnaire.questions = this.questionnaireFiltering.removeOrphans(questionnaire.questions!);
      await this.backendApi.createQuestionnaire(questionnaire);
    } catch (error) {
      return this.HandleError(error);
    }
  }

  async GetAllQuestionnaires(): Promise<Questionnaire[]> {
    try {
      return await this.backendApi.GetAllQuestionnaires();
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

  GetThresholds(questionnaire: Questionnaire, question: Question): ThresholdCollection {
    if (questionnaire && !questionnaire.thresholds)
      questionnaire.thresholds = []

    let thresholdCollection = questionnaire?.thresholds?.find(x => x.questionId == question.Id);

    if (!thresholdCollection) {
      thresholdCollection = new ThresholdCollection();
      thresholdCollection.questionId = question.Id!;
      questionnaire?.thresholds?.push(thresholdCollection);
    }

    const trueOption = new ThresholdOption();
    trueOption.option = true.toString();
    trueOption.category = CategoryEnum.GREEN
    const falseOption = new ThresholdOption();
    falseOption.option = false.toString();
    falseOption.category = CategoryEnum.GREEN

    thresholdCollection.thresholdOptions = [trueOption, falseOption];
    return thresholdCollection;
  }


  RemoveQuestion(questionnaire: Questionnaire, questionToRemove: Question): Questionnaire {
    if (!questionnaire?.questions)
      return questionnaire;

    const indexOfElementToRemove = questionnaire.questions.findIndex(q => q.Id == questionToRemove.Id)
    if (indexOfElementToRemove > -1)
      questionnaire.questions.splice(indexOfElementToRemove, 1);

    return questionnaire;
  }

  FindClosestIndex(closestToIndex: number, list: BaseQuestion[], predicate: (question: BaseQuestion, index: number) => boolean): number {
    //FindIndex-method starts at index 0 and increments from there
    //findClosestIndex-method starts at the closestToIndex-param and finds the index matching the given predicate that is closest to the the provided index

    let left = closestToIndex;
    let right = closestToIndex
    let iterations = 0;

    let result = -1;
    while (!(left == 0 && right == list.length - 1) && result == -1 && iterations < list.length) {
      if (predicate(list[left], left))
        result = left;
      if (predicate(list[right], right))
        result = right;

      left = left - 1 <= 0 ? 0 : left - 1;
      right = right + 1 > list.length ? list.length : right + 1;
      iterations++;
    }

    return result
  }

  MoveQuestion(questionnaire: Questionnaire, question: Question, step: number): Questionnaire {

    const questionToMoveIsParent = question.enableWhen?.questionId == undefined
    if (!questionnaire)
      return questionnaire;

    const oldQuestions = questionnaire.questions;
    if (!oldQuestions)
      return questionnaire;

    const fromPosition = oldQuestions.findIndex(q => q.Id == question.Id)


    const isQuestionParent = (question: Question) => question instanceof Question && question.enableWhen?.questionId == undefined;
    let toPosition = -1;

    const moveItemUp = step < 0;
    if (moveItemUp) {
      toPosition = this.FindClosestIndex(fromPosition, oldQuestions, (e, i) => i <= fromPosition + step && isQuestionParent(e) == questionToMoveIsParent)
    }

    const moveItemDown = step > 0;
    if (moveItemDown) {
      toPosition = this.FindClosestIndex(fromPosition, oldQuestions, (e, i) => i >= fromPosition + step && isQuestionParent(e) == questionToMoveIsParent)
    }
    console.log("toPosition")
    console.log(toPosition)
    if (toPosition == -1)
      return questionnaire;

    const fromPositionItem = oldQuestions[fromPosition];
    const toPositionItem = oldQuestions[toPosition];
    if (!fromPositionItem || !toPositionItem)
      return questionnaire;

    const newQuestions = oldQuestions;
    newQuestions[fromPosition] = toPositionItem;
    newQuestions[toPosition] = fromPositionItem;

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
      const hasNoParent = candidateEnableWhen == undefined
      if (hasNoParent)
        newQuestions.push(candidate);

      //If question has enableWhen, it is a childquestion
      //Now we need to figure out if the parent is in list, and that the parent is supported to have children
      //Right now it is only the boolean-type that can have children
      const parentExists = questions.find(q => q.Id == candidateEnableWhen?.questionId);
      const acceptableTypes = [QuestionTypeEnum.BOOLEAN]
      const parentIsSupportedToHaveChildren = acceptableTypes.some(at => parentExists?.type == at)
      if (parentExists && parentIsSupportedToHaveChildren)
        newQuestions.push(candidate)
    }

    return newQuestions;
  }

}