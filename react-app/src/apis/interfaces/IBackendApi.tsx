import { BaseModelStatus } from "../../components/Models/BaseModelStatus";
import { MeasurementType } from "../../components/Models/MeasurementType";
import { PaginatedList } from "../../components/Models/PaginatedList";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { Person } from "../../components/Models/Person";
import { PlanDefinition, PlanDefinitionStatus } from "../../components/Models/PlanDefinition";
import { Questionnaire, QuestionnaireStatus } from "../../components/Models/Questionnaire";
import { QuestionnaireResponseStatus, QuestionnaireResponse } from "../../components/Models/QuestionnaireResponse";
import { Task } from "../../components/Models/Task";
import { User } from "../../components/Models/User";

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
      * Retires a plandefinition
      * Uses the id of the provided plandefinition to target what plandefinition to be retired
      * @param planDefinition the desired plandefinition
      */
     retirePlanDefinition(planDefinition: PlanDefinition): Promise<void>;
    

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
     * Assumes the questionnaire already exists
     * Retires the given questionnaire based on the id of the provided entity
     * @param questionnaire the questionnaire to be retired
     */
     retireQuestionnaire(questionnaire: Questionnaire): Promise<void>;

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
    TerminateCareplan(careplan: PatientCareplan): Promise<void>;

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
    GetQuestionnaireResponses: (careplanId: string, questionnaireIds: string[], page: number, pagesize: number) => Promise<PaginatedList<QuestionnaireResponse>>

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


    /**
    * Returns true if the questionnanire is in use by any plandefinnition otherwise false
    */
    IsQuestionnaireInUse(questionnaireId: string): Promise<boolean>;

    /**
    * Returns true if the plandefinition is in use by any careplans otherwise false
    */
    IsPlanDefinitionInUse(planDefinitionId: string): Promise<boolean>;


    /**
     * Returns an array of questionnaires ids corrosponding to the questionnaires with unanswered questions
     * @param careplanId 
     */
    GetUnresolvedQuestionnaires(careplanId: string): Promise<string[]>;


    /**
     * Returns an array of plandefintions
     * @param statusesToInclude 
     */
    GetAllPlanDefinitionsForCarplan(statusesToInclude: (PlanDefinitionStatus | BaseModelStatus)[]): Promise<PlanDefinition[]>

}

