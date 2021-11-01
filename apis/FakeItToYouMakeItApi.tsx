import { Address } from "../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer, UnitType } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { DayEnum, Frequency, FrequencyEnum } from "../components/Models/Frequency";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import { IBackendApi } from "./IBackendApi";

export class FakeItToYouMakeItApi implements IBackendApi {

    patient1 : PatientDetail = new PatientDetail();
    careplan1 : PatientCareplan = new PatientCareplan();
    careplan2 : PatientCareplan = new PatientCareplan();
    planDefinition1 : PlanDefinition = new PlanDefinition();

    questionnaire1 : Questionnaire = new Questionnaire();

    //Response1
    questionnaireResponse1 : QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse2 : QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse3 : QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse4 : QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse5 : QuestionnaireResponse = new QuestionnaireResponse();
    question1 : Question = new Question();
    question2 : Question = new Question();
    question3 : Question = new Question();

    constructor(){
        //======================================= Patient
        this.patient1.cpr = "1212758392";
        this.patient1.firstname = "Jens"
        this.patient1.lastname = "Petersen"
        let patientContact = new Contact();
        patientContact.address = new Address();
        patientContact.address.city = "Aarhus C"
        patientContact.address.country = "Danmark"
        patientContact.address.road = "Fiskergade 66"
        patientContact.address.zipCode = "8000"
        this.patient1.patientContact = patientContact;
        let relativeContact = new Contact();
        relativeContact.fullname = "Johanne Petersen"
        relativeContact.primaryPhone = "27384910"
        relativeContact.emailAddress = "johannepetersen@mail.dk"
        relativeContact.address = new Address();
        relativeContact.address.city = "Aarhus C"
        relativeContact.address.country = "Danmark"
        relativeContact.address.road = "Fiskergade 66"
        relativeContact.address.zipCode = "8000"
        this.patient1.contacts = [relativeContact];

        this.planDefinition1.name = "Imundefekt"
        //======================================= Questions
        this.question1.question = "Jeg har det bedre i dag"
        this.question1.options = [
            this.CreateOption("1","Korekt",CategoryEnum.GREEN),
            this.CreateOption("2","Ved ikke",CategoryEnum.YELLOW),
            this.CreateOption("3","Ikke Korekt",CategoryEnum.RED),
        ]

        this.question2.question = "Hvad er din temperatur idag?"
        this.question2.thresholdPoint = [
            this.CreateThreshold("1",44,100,CategoryEnum.RED),
            this.CreateThreshold("2",38,44,CategoryEnum.YELLOW),
            this.CreateThreshold("3",0,37,CategoryEnum.GREEN),
        ]

        this.question3.question = "Hvor frisk føler du dig i dag (Fra 0-100, hvor 100 er det højeste)?"
        this.question3.thresholdPoint = [
            this.CreateThreshold("3",0,37,CategoryEnum.RED),
            this.CreateThreshold("2",37,44,CategoryEnum.YELLOW),
            this.CreateThreshold("1",44,100,CategoryEnum.GREEN),
        ]

        //======================================= Response // QuestionResponse1
        this.questionnaireResponse1.id = "qr1"
        this.questionnaireResponse1.patient = this.patient1;
        this.questionnaireResponse1.category = CategoryEnum.RED;
        this.questionnaireResponse1.answeredTime = this.CreateDate()
        this.questionnaireResponse1.status = QuestionnaireResponseStatus.NotProcessed;
        
        let questionAnswerMap1 = new Map<Question,Answer>();
         questionAnswerMap1.set(this.question1,this.CreateStringAnswer(this.question1.options[0].option));        
         questionAnswerMap1.set(this.question2,this.CreateNumberAnswer(37,UnitType.DEGREASE_CELSIUS));
         questionAnswerMap1.set(this.question3,this.CreateNumberAnswer(50,UnitType.NOUNIT));
         this.questionnaireResponse1.questions = questionAnswerMap1;
       

         //======================================= Response // QuestionResponse2
         this.questionnaireResponse2.id = "qr2"
         this.questionnaireResponse2.patient = this.patient1;
         this.questionnaireResponse2.category = CategoryEnum.RED;
         this.questionnaireResponse2.answeredTime = this.CreateDate()
         this.questionnaireResponse2.status = QuestionnaireResponseStatus.Processed;
         
         let questionAnswerMap2 = new Map<Question,Answer>();
         questionAnswerMap2.set(this.question1,this.CreateStringAnswer(this.question1.options[0].option));        
         questionAnswerMap2.set(this.question2,this.CreateNumberAnswer(35,UnitType.DEGREASE_CELSIUS));
         questionAnswerMap2.set(this.question3,this.CreateNumberAnswer(10,UnitType.NOUNIT));
         this.questionnaireResponse2.questions = questionAnswerMap2;

         //======================================= Response // QuestionResponse3
         this.questionnaireResponse3.id = "qr3"
         this.questionnaireResponse3.patient = this.patient1;
         this.questionnaireResponse3.category = CategoryEnum.RED;
         this.questionnaireResponse3.answeredTime = this.CreateDate()
         this.questionnaireResponse3.status = QuestionnaireResponseStatus.Processed;
         
         let questionAnswerMap3 = new Map<Question,Answer>();
         questionAnswerMap3.set(this.question1,this.CreateStringAnswer(this.question1.options[1].option));        
         questionAnswerMap3.set(this.question2,this.CreateNumberAnswer(37,UnitType.DEGREASE_CELSIUS));
         questionAnswerMap3.set(this.question3,this.CreateNumberAnswer(90,UnitType.NOUNIT));
         this.questionnaireResponse3.questions = questionAnswerMap3;
         //======================================= Response // QuestionResponse4
         this.questionnaireResponse4.id = "qr3"
         this.questionnaireResponse4.patient = this.patient1;
         this.questionnaireResponse4.category = CategoryEnum.RED;
         this.questionnaireResponse4.answeredTime = this.CreateDate()
         this.questionnaireResponse4.status = QuestionnaireResponseStatus.Processed;
         
         let questionAnswerMap4 = new Map<Question,Answer>();
         questionAnswerMap4.set(this.question1,this.CreateStringAnswer(this.question1.options[2].option));        
         questionAnswerMap4.set(this.question2,this.CreateNumberAnswer(42,UnitType.DEGREASE_CELSIUS));
         questionAnswerMap4.set(this.question3,this.CreateNumberAnswer(100,UnitType.NOUNIT));
         this.questionnaireResponse4.questions = questionAnswerMap4;
         //======================================= Response // QuestionResponse5
         this.questionnaireResponse5.id = "qr3"
         this.questionnaireResponse5.patient = this.patient1;
         this.questionnaireResponse5.category = CategoryEnum.RED;
         this.questionnaireResponse5.answeredTime = this.CreateDate()
         this.questionnaireResponse5.status = QuestionnaireResponseStatus.Processed;
         
         let questionAnswerMap5 = new Map<Question,Answer>();
         questionAnswerMap5.set(this.question1,this.CreateStringAnswer(this.question1.options[2].option));        
         questionAnswerMap5.set(this.question2,this.CreateNumberAnswer(44,UnitType.DEGREASE_CELSIUS));
         questionAnswerMap5.set(this.question3,this.CreateNumberAnswer(50,UnitType.NOUNIT));
         this.questionnaireResponse5.questions = questionAnswerMap5;

        //======================================= questionnaire
        this.questionnaire1.id = "q1"
        this.questionnaire1.name = "Imundefekt spørgeskema"
        let frequency = new Frequency();
        frequency.days = [DayEnum.Monday,DayEnum.Wednesday,DayEnum.Friday];
        frequency.repeated = FrequencyEnum.WEEKLY;
        this.questionnaire1.frequency = frequency;
        this.questionnaire1.questionnaireResponses = [this.questionnaireResponse1,this.questionnaireResponse2,this.questionnaireResponse3,this.questionnaireResponse4,this.questionnaireResponse5]

        //======================================= careplan
        this.careplan1.id = "plan1"
        this.careplan1.patient = this.patient1;
        this.careplan1.department = "Infektionssygdomme";
        this.careplan1.planDefinitions = [this.planDefinition1]
        this.careplan1.creationDate = this.CreateDate()
        this.careplan1.questionnaires = [this.questionnaire1]

        //======================================= careplan1
        this.careplan2.id = "plan2"
        this.careplan2.patient = this.patient1;
        this.careplan2.department = "Infektionssygdomme";
        this.careplan2.planDefinitions = [this.planDefinition1]
        this.careplan2.creationDate = this.CreateDate()
        this.careplan2.terminationDate = this.CreateDate()
        this.careplan2.questionnaires = [this.questionnaire1]
    }

    static date : Date = new Date()
    private CreateDate(){
        let days = 86400000 //number of milliseconds in a day
        FakeItToYouMakeItApi.date = new Date(FakeItToYouMakeItApi.date.getTime() - (1*days))
        return FakeItToYouMakeItApi.date;
    }
    private CreateStringAnswer(value : string){
        let answer = new StringAnswer();
        answer.answer = value;
        return answer;
    }

    private CreateNumberAnswer(value : number,unit : UnitType){
        let answer = new NumberAnswer();
        answer.answer = value;
        answer.unit = unit;
        return answer;

    }
    private CreateOption(id : string, value : string,category : CategoryEnum) : ThresholdOption{
        let option = new ThresholdOption();
        option.option = value;
        option.category = category;
        option.id = id
        return option;
    }

    private CreateThreshold(id : string, from : number,to : number, category : CategoryEnum) : ThresholdNumber{
        let option = new ThresholdNumber();
        option.category = category;
        option.id = id
        option.to = to;
        option.from = from;
        return option;
    }

    async GetTasklist(categories: CategoryEnum[], page: number, pagesize: number) : Promise<Questionnaire[]>{
        
        if(categories.some(x=>x == CategoryEnum.RED)){
            let questionnaireWithUniquePatients = new Questionnaire();
            questionnaireWithUniquePatients.name = this.questionnaire1.name;
            questionnaireWithUniquePatients.id = this.questionnaire1.id;
            questionnaireWithUniquePatients.frequency = this.questionnaire1.frequency;
            questionnaireWithUniquePatients.questionnaireResponses = this.GetUniqueList(this.questionnaire1.questionnaireResponses)
            return [questionnaireWithUniquePatients]
        }
            
        
        return [];
    }
    private GetUniqueList(questionnaireresponses : QuestionnaireResponse[]) : QuestionnaireResponse[]{
        let toReturn : QuestionnaireResponse[] = [];

        for(let i = 0;i<questionnaireresponses.length; i++){
            let potential = questionnaireresponses[i];
            if(potential.status == QuestionnaireResponseStatus.Processed){
                continue;
            }

            let existing = toReturn.find(a => a.patient.cpr == potential.patient.cpr)
            if(!existing){
                toReturn.push(potential)
            }
        }
        return toReturn;
    }

    async GetPatient(cpr: string) : Promise<PatientDetail>{
        return this.patient1;
    }
    async GetPatientCareplans(cpr: string) : Promise<PatientCareplan[]>{
        
        return [this.careplan1,this.careplan2];
    }

    async SetQuestionaireResponse(id: string, questionnaireResponses: QuestionnaireResponse) : Promise<void>{

    }
    async SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber) : Promise<void>{

    }
    async SetThresholdOption(thresholdId: string, threshold: ThresholdOption) : Promise<void>{

    }

}