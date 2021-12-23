import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PatientSimple } from "@kvalitetsit/hjemmebehandling/Models/PatientSimple";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";

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
     * Edit patient
     * @param patient patient to be edited
     */
    EditPatient(patient: PatientDetail): Promise<PatientDetail>;

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
     * Change questionnaire
     * Id should always be provided
     * To change the frequency fx, provide only frequency and id - Everything else will stay the same
     * @param questionnaireEdit 
     */
    SetQuestionnaire(questionnaireEdit: Questionnaire): Promise<void>;

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
     * Creates and returns patient
     * @param patient 
     */
    CreatePatient(patient: PatientDetail): Promise<PatientDetail>;

    /**
     * Returns person
     * @param person 
     */
    GetPerson(cpr: string): Promise<Person>;

    /**
     * Returns usercontext 
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
     * 
     */
    GetQuestionnaireResponses: (careplanId: string, questionnaireIds: string[], page: number, pagesize: number) => Promise<QuestionnaireResponse[]>
    /**
     * Change questionnaireResponse
     */
    SetQuestionaireResponse: (id: string, questionnaireResponses: QuestionnaireResponse) => Promise<void>

    /**
     * Set the value of threshold number
     */
    SetThresholdNumber: (thresholdId: string, threshold: ThresholdNumber) => Promise<void>

    /**
     * Set the value of threshold option
     */
    SetThresholdOption: (thresholdId: string, threshold: ThresholdOption) => Promise<void>


    /**
     * Returns patients based on paramaters
     */
    GetPatients: (includeActive: boolean, page: number, pageSize: number) => Promise<PatientDetail[]>
}

