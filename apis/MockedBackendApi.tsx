import { Address } from "../components/Models/Address";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { IBackendApi } from "./IBackendApi";


export class MockedBackendApi implements IBackendApi {
    GetPatient(cpr: string) : PatientDetail {

        let questionaireResponse = this.createRandomPatient(CategoryEnum.RED);
        let patient : PatientDetail = new PatientDetail(questionaireResponse.patient.name,cpr);
        
        let patientContact = new Contact();
        patientContact.address.country = "Danmark";
        patientContact.address.road = "Fiskergade 66";
        patientContact.address.zipCode = "8200 Aarhus C";
        patientContact.emailAddress = patient.name + "@mail.dk";
        patientContact.fullname = patient.name;
        patientContact.primaryPhone = "+4528395028"
        patient.patientContact = patientContact;

        let primaryContact = new Contact();
        primaryContact.address.country = "Danmark";
        primaryContact.address.road = "Jensgade 66";
        primaryContact.address.zipCode = "8200 Aarhus C";
        primaryContact.emailAddress = "GitteAndersen@mail.dk";
        primaryContact.fullname = "Gitte Andersen";
        primaryContact.primaryPhone = "+4592039485"
        primaryContact.favContact = true;
        
        
        let secondaryContact = new Contact();
        secondaryContact.address.country = "Danmark";
        secondaryContact.address.road = "Petersgade 66";
        secondaryContact.address.zipCode = "8210 Aarhus V";
        secondaryContact.emailAddress = "TimJensen@mail.dk";
        secondaryContact.fullname = "Tim Jensen";
        secondaryContact.primaryPhone = "+4538475920"
        secondaryContact.favContact = false;
        
        patient.contacts.push(primaryContact)
        patient.contacts.push(secondaryContact)
        
        return patient;
    }
    
    static results: QuestionnaireResponse[] = [];
    GetQuestionnaireResponses(categories : Array<CategoryEnum>, page : number, pagesize : number) : Array<QuestionnaireResponse>{
        
        let allCategories = [CategoryEnum.RED,CategoryEnum.YELLOW,CategoryEnum.GREEN,CategoryEnum.BLUE,]
        let array: QuestionnaireResponse[] = [];
        if(MockedBackendApi.results.length == 0){
            let numberOfPatients = pagesize;
            for(let i = 0; i < numberOfPatients; i++ ){
                let category = allCategories[this.getRandomInt(0,allCategories.length-1)]
                array.push(this.createRandomPatient(category));
            }
            MockedBackendApi.results = array;        
        }
        return MockedBackendApi.results.sort( (a,b)=>b.category - a.category).filter(patient=>categories.some(cat => cat == patient.category));
    }
    createRandomPatient(category : CategoryEnum) : QuestionnaireResponse{

        let names = ["Jens","Peter","Morten","Mads", "Thomas", "Eva", "Lene", "Frederik","Oscar"]
        let questionnaireNames = ["IVF til immundefekt"]

        let firstName = names[this.getRandomInt(0,names.length-1)]
        let lastName = names[this.getRandomInt(0,names.length-1)] + "sen"
        let questionnaireName = questionnaireNames[this.getRandomInt(0,questionnaireNames.length-1)]

        let questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.patient = new PatientSimple(firstName + " " + lastName,this.generateCPR());
        questionnaireResponse.category = category;
        questionnaireResponse.answeredTime = new Date();
        questionnaireResponse.questionnaire = new Questionnaire(questionnaireName);

        return questionnaireResponse;

    }

    getRandomInt(min : number, max : number) : number {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    generateCPR() : string {
        let cpr = "";
        for(let i = 0; i<10;i++){
            cpr += this.getRandomInt(0,10);
        }
        return cpr;

    }


}
