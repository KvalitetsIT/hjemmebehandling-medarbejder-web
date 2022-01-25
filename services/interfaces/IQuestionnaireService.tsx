import { Answer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";

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
     * Get all plan definitions
     */
    GetAllPlanDefinitions: () => Promise<Array<PlanDefinition>>

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
}

