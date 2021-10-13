import { IBackendApi } from "./IBackendApi";
import { MockedBackendApi } from "./MockedBackendApi";

export class BffBackendApi implements IBackendApi {
    async GetQuestionnaireResponses(categories : Array<CategoryEnum>, page : number, pagesize : number) : Promise<Array<QuestionnaireResponse>> {
        return new MockedBackendApi().GetQuestionnaireResponses(categories, page, pagesize);
    }

    async SetQuestionaireResponse(id: string, measurementCollection: QuestionnaireResponse) {
        return new MockedBackendApi().SetQuestionaireResponse(id, measurementCollection);
    }

    async GetMeasurements(cpr: string) : Promise<Array<QuestionnaireResponse>> {
        return new MockedBackendApi().GetMeasurements(cpr);
    }

    async GetPatient(cpr: string) : Promise<PatientDetail> {
        return new MockedBackendApi().GetPatient(cpr);
    }
}