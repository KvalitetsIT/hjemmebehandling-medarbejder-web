import { PatientCareplan } from "../components/Models/PatientCareplan";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { Questionnaire } from "../components/Models/Questionnaire";

export interface IBackendApi {
    GetTasklist : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Promise<Array<Questionnaire>>
    GetPatient : (cpr : string) => Promise<PatientDetail>
    GetPatientCareplans : (cpr: string) => Promise<Array<PatientCareplan>>
    SetQuestionaireResponse : (id : string, questionnaireResponses : QuestionnaireResponse) => Promise<void>
}

