import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import { PlanDefinition, PlanDefinitionStatus } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";

/**
 * Containing all methods that should call the actual api
 */
export interface IBackendApi {
    /**
   * Creates a plandefinition from provided plandefinition
   * @param planDefinition the plandefinition to be created
   */
    createPlanDefinition(planDefinition: PlanDefinition): Promise<void>;

    /**
         * Updates a plandefinition
         * Uses the id of the provided plandefinition to target what plandefinition to be changed
         * @param planDefinition the desired plandefinition
         */
    updatePlanDefinition(planDefinition: PlanDefinition): Promise<void>;

    /**
     * Creates a questionnaire from provided paramater
     * @param questionnaire the new questionnaire to be created
     */
    createQuestionnaire(questionnaire: Questionnaire): Promise<void>;

    /**
     * Assumes the questionnaire already exists
     * Updates the given questionnaire based on the id of the provided entity
     * @param questionnaire the questionnaire to be updated
     */
    updateQuestionnaire(questionnaire: Questionnaire): Promise<void>;

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
     * @returns all measurementtypes
     */
    GetAllMeasurementTypes(): Promise<MeasurementType[]>;

    /**
     * Returns all questionnaires based on filter
     * @param statusesToInclude If empty, all statuses are included in response
     * @returns all plandefinitions in system complying to the filters
     */
    GetAllQuestionnaires(statusesToInclude: (QuestionnaireStatus | BaseModelStatus)[]): Promise<Questionnaire[]>

    /**
     * Fetches all plandefinitions based on filters
     * @param statusesToInclude If empty, all statuses are included in response
     * @returns all plandefinitions in system complying to the filters
     */
    GetAllPlanDefinitions(statusesToInclude: (PlanDefinitionStatus | BaseModelStatus)[]): Promise<PlanDefinition[]>

    /**
     * Returns one single plandefinitions in system
     * @param planDefinitionId the id of the plandefinition to fetch
     * @returns one single plandefinition
     * @throws if plandefinition with id does not exist 
     */
    GetPlanDefinitionById(planDefinitionId: string): Promise<PlanDefinition>;


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
     * Checks whether the given cpr number has any unanswered questionnaires
     * @param cpr the cpr number to find unanswered for
     * @returns if true the patient has unanswered questionnaires
     */
    IsPatientOnUnanswered: (cpr: string) => Promise<boolean>

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
     * Gets one questionnaire based on the given questionnaireId
     * @param questionnaireId the id of the questionnaire to get 
     * @returns The questionnaire with the given id
     */
    GetQuestionnaire: (questionnaireId: string) => Promise<Questionnaire | undefined>

    /**
     * Returns patients based on paramaters
     */
    GetPatients: (includeActive: boolean, includeCompleted: boolean, page: number, pageSize: number) => Promise<PatientDetail[]>
}

