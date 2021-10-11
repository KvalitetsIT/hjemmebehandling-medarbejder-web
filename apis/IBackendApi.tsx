import { CategoryEnum } from "../components/Models/CategoryEnum";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";

export interface IBackendApi {
    GetQuestionnaireResponses : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Array<QuestionnaireResponse>
    GetPatient : (cpr : string) => PatientDetail

}