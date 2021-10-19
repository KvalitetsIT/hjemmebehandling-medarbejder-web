import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";

import { IBackendApi } from "./IBackendApi";
import { MockedBackendApi } from "./MockedBackendApi";

export class BffBackendApi implements IBackendApi {
    async GetPatientCareplans (cpr: string) : Promise<PatientCareplan[]>{
        return await new MockedBackendApi().GetPatientCareplans(cpr);
    }

    async GetTasklist(categories : Array<CategoryEnum>, page : number, pagesize : number) : Promise<Array<Questionnaire>> {
        let array: Questionnaire[] = await new MockedBackendApi().GetTasklist(categories, page, pagesize - 1);

       // let qr : QuestionnaireResponse = await this.createPatient(CategoryEnum.RED, "0101010101");
        //array.unshift(qr);

        return array;
    }

    async SetQuestionaireResponse(id: string, measurementCollection: QuestionnaireResponse) {
        return new MockedBackendApi().SetQuestionaireResponse(id, measurementCollection);
    }

    async GetMeasurements(cpr: string) : Promise<Array<QuestionnaireResponse>> {
        return new MockedBackendApi().GetMeasurements(cpr);
    }

    async GetPatient(cpr: string) : Promise<PatientDetail> {
        var status = -1;
        var body = null;
        await fetch(
            'http://localhost:8080/api/v1/patient',
            {
                'method': 'POST',
                'body': '{"cpr": "' + cpr + '"}',
                'headers': new Headers({'Content-Type': 'application/json'})
            })
            .then(res => res.json())
            .then(res => { body = res; })
            .catch(err => { console.log(err); });

        if(!body) {
            return new MockedBackendApi().GetPatient(cpr);
        }

        // Map the body to a PatientDetail object

        var name = body['familyName'] + ', ' + body['givenName'];
        let patient : PatientDetail = new PatientDetail();
        patient.firstname = body['familyName'];
        patient.lastname = body['givenName'];
        patient.cpr = cpr;

        let patientContact = new Contact();
        patientContact.address.country = "Danmark";
        patientContact.address.road = "Fiskergade 66";
        patientContact.address.zipCode = "8200 Aarhus C";
        patientContact.emailAddress = body['patientContactDetails']['emailAddress'];
        patientContact.fullname = name;
        patientContact.primaryPhone = body['patientContactDetails']['primaryPhone'];
        patient.patientContact = patientContact;

        return patient;
    }

    async createPatient(category : CategoryEnum, cpr: string) : Promise<QuestionnaireResponse> {
        let pd : PatientDetail = await this.GetPatient(cpr);
        
        let questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.patient = pd;
        questionnaireResponse.category = category;
        questionnaireResponse.answeredTime = new Date();

        return questionnaireResponse;
    }
}