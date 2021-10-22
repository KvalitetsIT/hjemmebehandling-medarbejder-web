import { PatientCareplan } from "../components/Models/PatientCareplan";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { Questionnaire } from "../components/Models/Questionnaire";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";

export interface IBackendApi {
    /**
     * Return a list of Questionnaireresponse
     * One patient can at most be represented once in the list - The answer with highest categori is shown 
     */
    GetTasklist : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Promise<Array<Questionnaire>>

    /**
     * Returns one patient
     */
    GetPatient : (cpr : string) => Promise<PatientDetail>

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

