import { Address } from "../components/Models/Address";
import { Answer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { Measurement, UnitType } from "../components/Models/Measurement";
import { QuestionnaireResponseStatus, MeasurementType, QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { IBackendApi } from "./IBackendApi";


export class MockedBackendApi implements IBackendApi {



    waitTimeMS = 1000

    async SetQuestionaireResponse(id: string, measurementCollection: QuestionnaireResponse) {
        await new Promise(f => setTimeout(f, this.waitTimeMS));
    };

    async GetMeasurements (cpr: string) : Promise<Array<QuestionnaireResponse>> {
        await new Promise(f => setTimeout(f, this.waitTimeMS));

        let collection1 = this.createRandomMeasurementCollection();
        let collection2 = this.createRandomMeasurementCollection();
        let collection3 = this.createRandomMeasurementCollection();
        return [collection1,collection2,collection3].sort( (a,b) => a.answeredTime.getTime() - b.answeredTime.getTime() );
    }


    async GetPatient(cpr: string) : Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.waitTimeMS));

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
    async GetQuestionnaireResponses(categories : Array<CategoryEnum>, page : number, pagesize : number) : Promise<Array<QuestionnaireResponse>>{
        await new Promise(f => setTimeout(f, this.waitTimeMS));
        let allCategories = [CategoryEnum.RED,CategoryEnum.YELLOW,CategoryEnum.GREEN,CategoryEnum.BLUE,]
        let array: QuestionnaireResponse[] = [];
        if(MockedBackendApi.results.length == 0){
            let numberOfPatients = pagesize;
            for(let i = 0; i < numberOfPatients; i++ ){
                let category = allCategories[this.getRandomInt(0,allCategories.length-1)]
                array.push(this.createRandomPatient(category));
            }
            array.unshift(this.createRandomPatient(CategoryEnum.RED, "0101010101"));
            MockedBackendApi.results = array;
        }


        return MockedBackendApi.results.sort( (a,b)=>b.category - a.category).filter(patient=>categories.some(cat => cat == patient.category));
    }

    createRandomMeasurementCollection(){
        let collection =  new QuestionnaireResponse();
        collection.answeredTime = new Date(this.getRandomInt(2000,2020),this.getRandomInt(1,30),this.getRandomInt(1,30));
        collection.status = QuestionnaireResponseStatus.NotProcessed;
        
        let measurement1 = new Measurement();
        measurement1.unit = UnitType.KG
        measurement1.value = this.getRandomInt(70,100)

        let measurement2 = new Measurement();
        measurement2.unit = UnitType.DEGREASE_CELSIUS
        measurement2.value = this.getRandomInt(20,40)


        let measurement3 = new Measurement();
        measurement3.unit = UnitType.DEGREASE_CELSIUS
        measurement3.value = this.getRandomInt(10,20)

        collection.measurements = new Map<MeasurementType,Measurement>();
        collection.measurements.set(MeasurementType.WEIGHT, measurement1);
        collection.measurements.set(MeasurementType.TEMPERATURE, measurement2);
        collection.measurements.set(MeasurementType.CRP, measurement3);

        
        collection.questions = new Map<Question,Answer>();
        let question = new Question();
        question.question = "Hvordan har du det med at komme til VM?"
        let answer = new Answer();
        answer.answer = "Ok"
        collection.questions.set(question,answer);
        

        return collection;
    }

    createRandomPatient(category : CategoryEnum) : QuestionnaireResponse {
        return this.createRandomPatient(category, this.generateCPR());
    }

    createRandomPatient(category : CategoryEnum, cpr: string) : QuestionnaireResponse{

        let names = ["Jens","Peter","Morten","Mads", "Thomas", "Eva", "Lene", "Frederik","Oscar"]
        let questionnaireNames = ["IVF til immundefekt"]

        let firstName = names[this.getRandomInt(0,names.length-1)]
        let lastName = names[this.getRandomInt(0,names.length-1)] + "sen"
        let questionnaireName = questionnaireNames[this.getRandomInt(0,questionnaireNames.length-1)]

        let questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.patient = new PatientSimple(firstName + " " + lastName, cpr);
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
