import { CategoryEnum } from "../components/Models/CategoryEnum";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";

export interface IBackendApi {
    GetQuestionnaireResponses : (categories : Array<CategoryEnum>, page : number, pagesize : number) => Array<QuestionnaireResponse>
}