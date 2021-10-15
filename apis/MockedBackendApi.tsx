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
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { Threshold } from "../components/Models/Threshold";


export class MockedBackendApi implements IBackendApi {

    questionnaireNames = ["Generelt infektionssygdomme spørgeskema","IVF til immundefekt","HIV Hjemmebehandling"];

    async GetPatientCareplans(cpr: string): Promise<PatientCareplan[]>{
        let careplan = await this.generateCareplan(1+"",cpr,false,2021);
        let careplan2 = await this.generateCareplan(2+"",cpr, true,2019);
        let careplan3 = await this.generateCareplan(3+"",cpr, true,2017);
        let careplan4 = await this.generateCareplan(4+"",cpr, true,2013);
        
        return [careplan,careplan2, careplan3, careplan4];
    }

    async generateCareplan(careplanId : string, cpr : string, hasTerminationDate : boolean, year : number) : Promise<PatientCareplan> {
        let careplan = new PatientCareplan();
        careplan.id = careplanId;
        let firstPlanDefinition = new PlanDefinition();
        firstPlanDefinition.name = "Hjemmebhandling af immundefekt"
        careplan.planDefinitions = [firstPlanDefinition]

        let questionnaire = new Questionnaire();
        questionnaire.name = this.questionnaireNames[0]
        let thresholdOne = new Threshold();
        questionnaire.thresholds = [thresholdOne]
        questionnaire.id = this.questionnaireNames.indexOf(questionnaire.name)+""
        questionnaire.questionnaireResponses = await this.GetMeasurements(cpr);

        let questionnaire2 = new Questionnaire();


        questionnaire2.name = this.questionnaireNames[1];
        questionnaire2.id = this.questionnaireNames.indexOf(questionnaire2.name)+""
        questionnaire2.questionnaireResponses = await this.GetMeasurements(cpr);


        careplan.questionnaires = [questionnaire,questionnaire2]
        careplan.patient = await this.GetPatient(cpr);
        careplan.creationDate = new Date(year,this.getRandomInt(1,30),this.getRandomInt(1,30));
        if(hasTerminationDate)
            careplan.terminationDate = new Date(year+1,this.getRandomInt(1,30),this.getRandomInt(1,30));
        return careplan;
    }

    waitTimeMS = 0

    async SetQuestionaireResponse(id: string, measurementCollection: QuestionnaireResponse) {
        await new Promise(f => setTimeout(f, this.waitTimeMS));
    };

    async GetMeasurements (cpr: string) : Promise<Array<QuestionnaireResponse>> {
        await new Promise(f => setTimeout(f, this.waitTimeMS));

        

        let collection1 = this.createRandomMeasurementCollection();
        let collection2 = this.createRandomMeasurementCollection();
        let collection3 = this.createRandomMeasurementCollection();
        let collection4 = this.createRandomMeasurementCollection();
        let collection5 = this.createRandomMeasurementCollection();

        return [collection1,collection2,collection3,collection4,collection5].sort( (a,b) => a.answeredTime.getTime() - b.answeredTime.getTime() );
    }


    async GetPatient(cpr: string) : Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.waitTimeMS));

        let questionaireResponse = this.createQuestionnaireResponse(CategoryEnum.RED);
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
    
    static results: Questionnaire[] = [];
    async GetPatientQuestionnaires(categories : Array<CategoryEnum>, page : number, pagesize : number) : Promise<Array<Questionnaire>>{
        await new Promise(f => setTimeout(f, this.waitTimeMS));
        let allCategories = [CategoryEnum.RED,CategoryEnum.YELLOW,CategoryEnum.GREEN,CategoryEnum.BLUE]

        let array: Questionnaire[] = [];
        if(MockedBackendApi.results.length == 0){
            let numberOfPatients = pagesize;
            for(let i = 0; i < numberOfPatients; i++ ){

                
                

                let category = allCategories[this.getRandomInt(0,allCategories.length-1)]
                let questionnaire = new Questionnaire();
                let questionnaireName = this.questionnaireNames[this.getRandomInt(0,this.questionnaireNames.length-1)]
                questionnaire.name = questionnaireName;
                questionnaire.id = this.questionnaireNames.indexOf(questionnaire.name)+""
                questionnaire.questionnaireResponses = [this.createQuestionnaireResponse(category),this.createQuestionnaireResponse(category)];
                array.push(questionnaire);
            }
            MockedBackendApi.results = array;
        }



        return MockedBackendApi.results
                .filter(questionnaire => questionnaire.questionnaireResponses.some(resp => categories.some(cat => cat == resp.category)));
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
        for(let i = 0; i<200; i++){
            let posibleQuestions = ["Hvordan har du det?","Føler du dig tryg?","Har du nye symptomer? Hvis ja - Hvilke?","Føler du din helbredstilstand er blevet værre?","Har du problemer med kateter?","Har du problemer med antibiotika?"]
            let posibleAnswers = ["Fint","Ja","Nej","Rotterne gnaver"]
            let question = new Question();
            question.question = posibleQuestions[this.getRandomInt(0,posibleQuestions.length-1)]
    
            let answer = new Answer();
            answer.answer = posibleAnswers[this.getRandomInt(0,posibleAnswers.length-1)]
    
            
            collection.questions.set(question,answer);
        }
        
        console.log(collection.questions)
        return collection;
    }

    createQuestionnaireResponse(category : CategoryEnum) : QuestionnaireResponse{

        let names = ["Jens","Peter","Morten","Mads", "Thomas", "Eva", "Lene", "Frederik","Oscar"]
        

        let firstName = names[this.getRandomInt(0,names.length-1)]
        let lastName = names[this.getRandomInt(0,names.length-1)] + "sen"
        

        let questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.patient = new PatientSimple(firstName + " " + lastName, this.generateCPR());
        questionnaireResponse.category = category;
        questionnaireResponse.answeredTime = new Date();
        questionnaireResponse.id = this.generateCPR();

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
            if(i == 6) 
                cpr += "-"
            cpr += this.getRandomInt(0,9);
        }
        return cpr;

    }
}
