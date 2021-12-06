import { PatientCareplan } from "../components/Models/PatientCareplan";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { PersonDto } from "../generated/models/PersonDto";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { Questionnaire } from "../components/Models/Questionnaire";
import { Task } from "../components/Models/Task";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { UserContext } from "../generated";

export interface IBackendApi {

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
    TerminateCareplan(careplan : PatientCareplan) : Promise<PatientCareplan>;

    /**
     * Update status on QuestionnaireResponse.
     * @param id The id of the QuestionnaireResponse
     * @param status The new status
     */
    UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus) : Promise<void>;

    /**
     * Return a list of Questionnaireresponses that have not yet finished processing.
     */
    GetUnfinishedQuestionnaireResponseTasks : (page : number, pagesize : number) => Promise<Array<Task>>

    /**
     * Return a list of Questionnaires that are overdue.
     */
    GetUnansweredQuestionnaireTasks : (page : number, pagesize : number) => Promise<Array<Task>>

    /**
     * Returns one patient
     */
    GetPatient : (cpr : string) => Promise<PatientDetail>

    /**
     * Returns all patients that either has match in name or CPR
     */
    SearchPatient : (searchstring : string) => Promise<PatientDetail[]>

    /**
     * Creates and returns patient
     * @param patient 
     */
    CreatePatient(patient: PatientDetail): Promise<PatientDetail>;

    /**
     * Returns person
     * @param person 
     */
    GetPerson(cpr: string): Promise<PersonDto>;

    /**
     * Returns usercontext 
     */
    GetUser(): Promise<UserContext>;

    /**
     * Returns all patient careplans for one patient
     */
    GetPatientCareplans : (cpr: string) => Promise<Array<PatientCareplan>>

    /**
     * Returns patient careplans by id
     */
    GetPatientCareplanById : (id: string) => Promise<PatientCareplan>
    
    /**
     * 
     */
    GetQuestionnaireResponses : (careplanId : string, questionnaireIds : string[], page : number, pagesize : number) => Promise<QuestionnaireResponse[]>
    /**
     * Change questionnaireResponse
     */
    SetQuestionaireResponse : (id : string, questionnaireResponses : QuestionnaireResponse) => Promise<void>

    /**
     * Set the value of threshold number
     */
    SetThresholdNumber : (thresholdId : string, threshold : ThresholdNumber) => Promise<void>

    /**
     * Set the value of threshold option
     */
    SetThresholdOption : (thresholdId : string, threshold : ThresholdOption) => Promise<void>


    /**
     * Returns patients based on paramaters
     */
    GetPatients : (includeActive : boolean, includeInactive : boolean, page : number, pageSize : number) => Promise<PatientDetail[]>
}

