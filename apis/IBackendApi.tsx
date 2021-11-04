import { PatientCareplan } from "../components/Models/PatientCareplan";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { Questionnaire } from "../components/Models/Questionnaire";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import { PlanDefinition } from "../components/Models/PlanDefinition";

export interface IBackendApi {
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
     * Change careplan
     * Id should always be provided
     * To change the terminationdate fx, provide only terminationdate and id - Everything else will stay the same
     * @param careplan
     */
    SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan>;
    
    /**
     * Return a list of Questionnaireresponse
     * One patient can at most be represented once in the list - The answer with highest categori is shown 
     */
    GetTasklist : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Promise<Array<Questionnaire>>

    /**
     * Returns one patient
     */
    GetPatient : (cpr : string) => Promise<PatientDetail | undefined>

    /**
     * Returns all patients that either has match in name or CPR
     */
    SearchPatient : (searchstring : string) => Promise<PatientSimple[]>

    /**
     * Creates and returns patient
     * @param patient 
     */
    CreatePatient(patient: PatientDetail): Promise<PatientDetail>;

    /**
     * Returns all patient careplans for one patient
     */
    GetPatientCareplans : (cpr: string) => Promise<Array<PatientCareplan>>
    
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
}

