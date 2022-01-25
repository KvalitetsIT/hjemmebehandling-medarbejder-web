import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";

/**
 * Containing all methods that should call the actual api
 */
export interface IBackendApi {
    /**
     * Resets a patient-users password
     * @param patient 
     */
    ResetPassword(patient: PatientDetail): Promise<void>;

    /**
     * Remove task from missing-answer-overview
     * @param task task to remove from overview
     */
    RemoveAlarm(task: Task): Promise<void>;
    
    /**
     * Returns all plandefinitions in system
     */
    GetAllPlanDefinitions(): Promise<PlanDefinition[]>;


    /**
     * Add a questionnaire to the careplan
     * @param careplan Careplan to add questionnaire to
     * @param questionnaireToAdd Questionnaire to add to careplan
     */
    AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan>;

    /**
     * Creates careplan and returns its id.
     * @param carePlan
     */
    CreateCarePlan(CarePlan: PatientCareplan): Promise<string>;

    /**
     * Change careplan
     * Id should always be provided
     * To change the terminationdate fx, provide only terminationdate and id - Everything else will stay the same
     * @param careplan
     */
    SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan>;

    /**
     * Is used to terminate a careplan
     * @param careplan careplan to terminate
     */
    TerminateCareplan(careplan: PatientCareplan): Promise<PatientCareplan>;

    /**
     * Update status on QuestionnaireResponse.
     * @param id The id of the QuestionnaireResponse
     * @param status The new status
     */
    UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus): Promise<QuestionnaireResponseStatus>;

    /**
     * Return a list of Questionnaireresponses that have not yet finished processing.
     */
    GetUnfinishedQuestionnaireResponseTasks: (page: number, pagesize: number) => Promise<Array<Task>>

    /**
     * Return a list of Questionnaires that are overdue.
     */
    GetUnansweredQuestionnaireTasks: (page: number, pagesize: number) => Promise<Array<Task>>

    /**
     * Returns all patients that either has match in name or CPR
     */
    SearchPatient: (searchstring: string) => Promise<PatientDetail[]>

    /**
     * Returns person
     * @param person 
     */
    GetPerson(cpr: string): Promise<Person>;

    /**
     * Returns the user logged in
     */
    GetActiveUser(): Promise<User>;

    /**
     * Returns all patient careplans for one patient
     */
    GetPatientCareplans: (cpr: string) => Promise<Array<PatientCareplan>>

    /**
     * Returns patient careplans by id
     */
    GetPatientCareplanById: (id: string) => Promise<PatientCareplan>

    /**
     * Returns all questionnaireresponses that has reference to, any of the provided questionnaireIds, and careplanId
     */
    GetQuestionnaireResponses: (careplanId: string, questionnaireIds: string[], page: number, pagesize: number) => Promise<QuestionnaireResponse[]>

    /**
     * Returns patients based on paramaters
     */
    GetPatients: (includeActive: boolean,includeCompleted: boolean, page: number, pageSize: number) => Promise<PatientDetail[]>
}

