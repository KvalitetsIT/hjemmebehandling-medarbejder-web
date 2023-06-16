import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";

/**
 * QuestionnaireService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export interface IQuestionnaireService {



  //====================FIND====================
  /**
   * Goes through all the provided questionnaireResponses 
   *  - All elements in list that are undefined will be removed
   * Returns all questions - No questions should be duplicates
   */
  findAllQuestions: (questionResponses: Array<QuestionnaireResponse | undefined>) => Question[]

  /**
    * Gets one questionnaire based on the given questionnaireId
    * @param questionnaireId the id of the questionnaire to get 
    * @returns The questionnaire with the given id
    */
  getQuestionnaire: (questionnaireId: string) => Promise<Questionnaire | undefined>

  /**
     * Assumes the questionnaire already exists
     * Updates the given questionnaire based on the id of the provided entity
     * @param questionnaire the questionnaire to be updated
     */
  updateQuestionnaire(questionnaire: Questionnaire): Promise<void>

  /**
    * Assumes the questionnaire already exists
    * Retires the given questionnaire based on the id of the provided entity
    * @param questionnaire the questionnaire to be retired
    */
   retireQuestionnaire(questionnaire: Questionnaire): Promise<void>

  /**
     * Creates a questionnaire from provided paramater
     * @param questionnaire the new questionnaire to be created
     */
  createQuestionnaire(questionnaire: Questionnaire): Promise<void>

  /**
   * Provide a response, and a question - and you shall recieve the answer.
   * If the question does not exist in the response, you shall recieve undefined.
   */
  findAnswer: (desiredQuestion: Question, questionResponses: QuestionnaireResponse) => Answer | undefined;

  //====================GET====================
  /**
   * Get all tasks that has been answered, but are not processed yet
   */
  GetUnfinishedQuestionnaireResponseTasks: (page: number, pagesize: number) => Promise<Array<Task>>

  /**
   * Get all tasks that has not been answered
   */
  GetUnansweredQuestionnaireTasks: (page: number, pagesize: number) => Promise<Array<Task>>

  /**
   * Checks whether the given cpr number has any unanswered questionnaires
   * @param cpr the cpr number to find unanswered for
   * @returns if true the patient has unanswered questionnaires
   */
  IsPatientOnUnanswered: (cpr: string) => Promise<boolean>

  /**
   * Returns all questionnaires
   */
  GetAllQuestionnaires(statusesToInclude: (QuestionnaireStatus | BaseModelStatus)[]): Promise<Questionnaire[]>

  /**
   * Returns all questionnaireresponses that
   * - Has a reference to the provided careplan and
   * - Has a reference to any of the provided questionnaireids
   */
  GetQuestionnaireResponses: (careplanId: string, questionnaireIds: string[], page: number, pagesize: number) => Promise<QuestionnaireResponse[]>

  /**
   * Adds the provided questionnaire to the provided careplan
   */
  AddQuestionnaireToCareplan: (careplan: PatientCareplan, questionnaireToAdd: Questionnaire) => Promise<PatientCareplan>

  /**
   * Updates the questionnaireResponse with the provided id
   * - Sets the status to the provided status
   */
  UpdateQuestionnaireResponseStatus: (id: string, status: QuestionnaireResponseStatus) => Promise<QuestionnaireResponseStatus>;

  /**
   * Remove the alarm from a task so that it is not shown in the "ikke besvaret"-section
   */
  RemoveAlarm: (task: Task) => Promise<void>;

  /**
   * Finds the thresholds for a given question in a provided questionnaire
   * @param questionnaire the questionnaire containing thresholds for question
   * @param question The question to find (only the id is actually used)
   * @returns One thresholdcollection containing all thresholds for question
   */
  GetThresholds(questionnaire: Questionnaire, question: Question): ThresholdCollection;

  /**
   * Removes a question from a questionnaire
   * @param questionnaire to remove question from
   * @param questionToRemove the questino to be removed from the given questionnaire
   * @returns the modified questionnaire
   */
  RemoveQuestion(questionnaire: Questionnaire, questionToRemove: Question): Questionnaire

  /**
   * Move a question in a questionnaire up or down depending on the step-param
   * @param questionnaire the questionnaire containing the questions to change order for
   * @param question the question to move
   * @param step the number of positions to move the question (1 og -1 is often used)
   */
  MoveQuestion(questionnaire: Questionnaire, question: Question, step: number): Questionnaire

  /**
   * Checks if the given questionnaire is in use by any plandefinitions
   * @param questionnaire the questionnaire that is supposed to be checked 
   * @returns true if the questionnaire is in use by any active plandefintions otherwise false  
  */
  IsQuestionnaireInUse(questionnaireId: string): Promise<boolean>
}

