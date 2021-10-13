import { Contact } from "../components/Models/Contact";
import { PatientDetail } from "../components/Models/PatientDetail";

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
        // curl -d '{"cpr": "0101010101"}' -H 'Content-Type: application/json' localhost:8080/api/v1/patient

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
            .then(res => { body = res; });

        if(!body) {
            return new MockedBackendApi().GetPatient(cpr);
        }

        // Map the body to a PatientDetail object

        var name = body['familyName'] + ', ' + body['givenName'];
        let patient : PatientDetail = new PatientDetail(name, cpr);

        let patientContact = new Contact();
        patientContact.address.country = "Danmark";
        patientContact.address.road = "Fiskergade 66";
        patientContact.address.zipCode = "8200 Aarhus C";
        patientContact.emailAddress = patient.name + "@mail.dk";
        patientContact.fullname = patient.name;
        patientContact.primaryPhone = "+4528395028"
        patient.patientContact = patientContact;

        return patient;
    }
}