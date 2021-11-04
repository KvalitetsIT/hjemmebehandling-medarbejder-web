import { Address } from "../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer, UnitType } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { QuestionnaireResponseStatus, MeasurementType, QuestionnaireResponse } from "../components/Models/QuestionnaireResponse";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { IBackendApi } from "./IBackendApi";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";

export class MockedBackendApi implements IBackendApi {
    async SearchPatient(searchstring: string) : Promise<PatientSimple[]>{
        return [];
    }
    GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
        throw new Error("Method not implemented.");
    }
    AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }
    SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }
    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus) : Promise<void> {
        throw new Error("Method not implemented.");
    }
    CreatePatient(patient: PatientDetail): Promise<PatientDetail> {
        throw new Error("Method not implemented.");
    }
    async SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber){

    }
    async SetThresholdOption(thresholdId: string, threshold: ThresholdOption){

    }

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

        return [collection1,collection2,collection3,collection4,collection5].sort( (a,b) => a.answeredTime!.getTime() - b.answeredTime!.getTime() );
    }


    async GetPatient(cpr: string) : Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.waitTimeMS));

        let questionaireResponse = this.createQuestionnaireResponse(CategoryEnum.RED);
        let patient : PatientDetail = new PatientDetail();
        patient.cpr = cpr;
        patient.firstname = questionaireResponse.patient.firstname;
        patient.lastname = questionaireResponse.patient.lastname;

        let patientContact = new Contact();
        patientContact.address.country = "Danmark";
        patientContact.address.road = "Fiskergade 66";
        patientContact.address.zipCode = "8200 Aarhus C";
        patientContact.emailAddress = patient.firstname + "@mail.dk";
        patientContact.fullname = patient.firstname +" "+ patient.lastname;
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
    async GetTasklist(categories : Array<CategoryEnum>, page : number, pagesize : number) : Promise<Array<Questionnaire>>{
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
        

        collection.questions = new Map<Question,Answer>();

        let measurementQuestion = new Question();
        measurementQuestion.question = "Hvad er din temperatur?"
        let thresholdWeight = new ThresholdNumber();
        thresholdWeight.from = 40;
        thresholdWeight.to = 120;
        thresholdWeight.category = CategoryEnum.RED;
        measurementQuestion.thresholdPoint = [thresholdWeight]
        let measurementAnswer = new NumberAnswer();
        measurementAnswer.answer = this.getRandomInt(30,42);
        measurementAnswer.unit = UnitType.DEGREASE_CELSIUS;
        collection.questions.set(measurementQuestion,measurementAnswer);

        let measurementQuestion2 = new Question();
        measurementQuestion2.question = "Hvad er din vægt?"
        let thresholdPoint = new ThresholdNumber();
        thresholdPoint.from = 90;
        thresholdPoint.to = 120;
        thresholdPoint.category = CategoryEnum.RED;
        let thresholdPoint2 = new ThresholdNumber();
        thresholdPoint2.from = 75;
        thresholdPoint2.to = 90;
        thresholdPoint2.category = CategoryEnum.YELLOW;
        measurementQuestion2.thresholdPoint = [thresholdPoint,thresholdPoint2]
        let measurementAnswer2 = new NumberAnswer();
        measurementAnswer2.answer = this.getRandomInt(60,120);
        measurementAnswer2.unit = UnitType.KG;
        collection.questions.set(measurementQuestion2,measurementAnswer2);
        
        for(let i = 0; i<200; i++){
            let posibleQuestions = ["Hvordan har du det?","Føler du dig tryg?","Har du nye symptomer? Hvis ja - Hvilke?","Føler du din helbredstilstand er blevet værre?","Har du problemer med kateter?","Har du problemer med antibiotika?"]
            let posibleAnswers = ["Fint","Ja","Nej","Rotterne gnaver"]
            let question = new Question();
            let threshold = new ThresholdOption;
            threshold.option = "Nej"
            threshold.category = CategoryEnum.RED
            question.options = [threshold];
            question.question = posibleQuestions[this.getRandomInt(0,posibleQuestions.length-1)]
    
            let answer = new StringAnswer();
            answer.answer = posibleAnswers[this.getRandomInt(0,posibleAnswers.length-1)]
            
            
            collection.questions.set(question,answer);
        }
        
        console.log(collection.questions)
        return collection;
    }

    createQuestionnaireResponse(category : CategoryEnum) : QuestionnaireResponse{

        let names = ["Jens","Peter","Morten","Mads", "Thomas", "Eva", "Lene", "Frederik","Oscar","Anne"]
        

        let firstName = names[this.getRandomInt(0,names.length-1)]
        let lastName = names[this.getRandomInt(0,names.length-1)] + "sen"
        

        let questionnaireResponse = new QuestionnaireResponse();
        questionnaireResponse.patient = new PatientSimple();
        questionnaireResponse.patient.firstname = firstName;
        questionnaireResponse.patient.lastname = lastName;
        questionnaireResponse.patient.cpr = this.generateCPR();
        questionnaireResponse.status = QuestionnaireResponseStatus.NotProcessed
        questionnaireResponse.answeredTime = new Date();
        if(category == CategoryEnum.BLUE){
            questionnaireResponse.status = undefined;
            questionnaireResponse.answeredTime = undefined;
        }
            

        questionnaireResponse.category = category;
        
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
