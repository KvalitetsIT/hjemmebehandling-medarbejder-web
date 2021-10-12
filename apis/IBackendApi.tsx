import { CategoryEnum } from "../components/Models/CategoryEnum";
import { MeasurementCollection } from "../components/Models/MeasurementCollection";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";

export interface IBackendApi {
    GetQuestionnaireResponses : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Promise<Array<QuestionnaireResponse>>
    GetPatient : (cpr : string) => Promise<PatientDetail>
    GetMeasurements : (cpr : string) => Promise<Array<MeasurementCollection>>
    SetQuestionaireResponse : (id : string, measurementCollection : MeasurementCollection) => Promise<void>
}

