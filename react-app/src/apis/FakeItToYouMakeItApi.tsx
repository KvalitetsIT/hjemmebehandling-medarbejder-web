/* eslint-disable */


import BaseApi from "../components/BaseLayer/BaseApi";
import { NotImplementedError } from "../components/Errorhandling/ApiErrors/NotImplementedError";
import { NotFoundError } from "../components/Errorhandling/ServiceErrors/NotFoundError";
import { QuestionnaireAlreadyOnCareplan } from "../components/Errorhandling/ServiceErrors/QuestionnaireAlreadyOnCareplan";
import { Address } from "../components/Models/Address";
import { Answer, UnitType, StringAnswer, NumberAnswer, BooleanAnswer, GroupAnswer } from "../components/Models/Answer";
import { BaseModelStatus } from "../components/Models/BaseModelStatus";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { ContactDetails } from "../components/Models/Contact";
import { EnableWhen } from "../components/Models/EnableWhen";
import { Frequency, DayEnum, FrequencyEnum } from "../components/Models/Frequency";
import { MeasurementType } from "../components/Models/MeasurementType";
import { PaginatedList } from "../components/Models/PaginatedList";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { Person } from "../components/Models/Person";
import PersonContact from "../components/Models/PersonContact";
import { PlanDefinition, PlanDefinitionStatus } from "../components/Models/PlanDefinition";
import { PrimaryContact } from "../components/Models/PrimaryContact";
import { Question, QuestionTypeEnum } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import SimpleOrganization from "../components/Models/SimpleOrganization";
import { Task } from "../components/Models/Task";
import { ThresholdCollection } from "../components/Models/ThresholdCollection";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import { User } from "../components/Models/User";
import { IBackendApi } from "./interfaces/IBackendApi";
import ExternalToInternalMapper from "./Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "./Mappers/InternalToExternalMapper";



export class FakeItToYouMakeItApi extends BaseApi implements IBackendApi {

    timeToWait: number = 0;

    taskRemovedFromMissingOverview: Task[] = [];
    patient1: PatientDetail = new PatientDetail();
    person1: Person = new Person();

    measurementType1: MeasurementType = new MeasurementType();
    measurementType2: MeasurementType = new MeasurementType();
    measurementTypeSystolisk: MeasurementType = new MeasurementType();
    measurementTypeDiastolisk: MeasurementType = new MeasurementType();

    careplan1: PatientCareplan = new PatientCareplan();
    careplan2: PatientCareplan = new PatientCareplan();
    allCareplans: PatientCareplan[] = [this.careplan1, this.careplan2];

    planDefinition1: PlanDefinition = new PlanDefinition();
    planDefinition2: PlanDefinition = new PlanDefinition();
    allPlanDefinitions: PlanDefinition[] = [];

    questionnaire1: Questionnaire = new Questionnaire();
    questionnaire2: Questionnaire = new Questionnaire();
    questionnaire3: Questionnaire = new Questionnaire();
    questionnaire4: Questionnaire = new Questionnaire();
    allQuestionnaires: Questionnaire[] = [this.questionnaire1, this.questionnaire2, this.questionnaire3, this.questionnaire4]

    //Response1
    questionnaireResponse1: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse2: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse3: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse4: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse5: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponseGroupQuestionnaire: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponseGroupQuestionnaire2: QuestionnaireResponse = new QuestionnaireResponse();
    question1: Question = new Question();
    question2: Question = new Question();
    question3: Question = new Question();
    question4: Question = new Question();
    groupQuestion: Question = new Question();
    callToActionQuestion1: Question = new Question();

    tc1 = new ThresholdCollection();
    tc2 = new ThresholdCollection();
    tc3 = new ThresholdCollection();
    tc4 = new ThresholdCollection();
    tc5_sys = new ThresholdCollection();
    tc5_dia = new ThresholdCollection();

    task1: Task = new Task();
    task2: Task = new Task();
    task3: Task = new Task();


    toInternal = new ExternalToInternalMapper();
    toExternal = new InternalToExternalMapper();

    constructor() {
        super();
        this.measurementType1 = new MeasurementType();
        this.measurementType1.displayName = "CRP"
        this.measurementType1.code = "CRP"
        this.measurementType1.system = "system"
        this.measurementType2 = new MeasurementType();
        this.measurementType2.displayName = "Temperatur"
        this.measurementType2.code = "Temperatur"
        this.measurementType2.system = "system"
        this.measurementTypeSystolisk = new MeasurementType();
        this.measurementTypeSystolisk.displayName = "Blodtryk systolisk; Arm"
        this.measurementTypeSystolisk.code = "SYS"
        this.measurementTypeSystolisk.system = "system"
        this.measurementTypeDiastolisk = new MeasurementType();
        this.measurementTypeDiastolisk.displayName = "Blodtryk diastolisk; Arm"
        this.measurementTypeDiastolisk.code = "DIA"
        this.measurementTypeDiastolisk.system = "system"
        //======================================= Patient
        this.patient1.cpr = "1212758392";
        this.patient1.firstname = "Jens"
        this.patient1.lastname = "Petersen"
        this.patient1.username = "JENPET" //Username is 6 chars


        const address = new Address();
        address.city = "Aarhus C"
        address.country = "Danmark"
        address.street = "Fiskergade 66"
        address.zipCode = "8000"


        const contactDetails = new ContactDetails()
        contactDetails.address = address;
        contactDetails.primaryPhone = "+4529483749"
        contactDetails.secondaryPhone = "29483749"

        this.patient1.contact = contactDetails

        const primaryContact = new PrimaryContact();
        primaryContact.fullname = "Johanne Petersen"
        primaryContact.affiliation = "Kone"

        primaryContact.contact = new ContactDetails()
        primaryContact.contact.primaryPhone = "27384910"
        primaryContact.contact.secondaryPhone = "2222222"
        this.patient1.primaryContact = primaryContact;

        this.person1.cpr = "2512489996"
        this.person1.givenName = "Nancy Ann"
        this.person1.familyName = "Berggren"
        const personContact = new PersonContact();
        personContact.city = "Aarhus C";
        personContact.postalCode = "8000";
        personContact.street = "Fiskergade 66"
        personContact.primaryPhone = "29483749"

        this.person1.patientContactDetails = personContact;

        //======================================= Questions
        this.question1.Id = "q1";
        this.question1.abbreviation = "Bedre idag?";
        this.question1.question = "Jeg har det bedre i dag"
        this.question1.type = QuestionTypeEnum.BOOLEAN;
        this.question1.helperText = "Er du nu sikker på at du har det bedre i dag?"

        this.question2.abbreviation = "Temperatur";
        this.question2.Id = "q2";
        this.question2.question = "Hvad er din temperatur idag?"
        this.question2.type = QuestionTypeEnum.OBSERVATION;
        this.question2.measurementType = this.measurementType2

        this.question3.Id = "q3";
        this.question3.abbreviation = "Frisk idag?";
        this.question3.question = "Føler du dig frisk idag?"
        this.question3.type = QuestionTypeEnum.BOOLEAN;

        this.question4.Id = "q4";
        this.question4.abbreviation = "Godt i dag?";
        const q4EnableWhen = new EnableWhen<boolean>();
        q4EnableWhen.questionId = this.question1.Id;
        this.question4.enableWhen = q4EnableWhen;
        this.question4.question = "Har du det godt i dag?"
        this.question4.type = QuestionTypeEnum.BOOLEAN;

        this.groupQuestion.Id = "q5";
        this.groupQuestion.question = "Blodtryk?";
        this.groupQuestion.type = QuestionTypeEnum.GROUP;
        const q5EnableWhen = new EnableWhen<boolean>();
        q5EnableWhen.questionId = undefined;
        //this.groupQuestion.enableWhen = q5EnableWhen

        const sys = new Question();
        sys.Id = "q5_sys";
        sys.question = "SYS"
        sys.type = QuestionTypeEnum.OBSERVATION;
        sys.measurementType = this.measurementTypeSystolisk;
        const dia = new Question();
        dia.Id = "q5_dia";
        dia.question = "DIA"
        dia.type = QuestionTypeEnum.OBSERVATION;
        dia.measurementType = this.measurementTypeDiastolisk;
        this.groupQuestion.subQuestions = [sys, dia]

        this.callToActionQuestion1.abbreviation = "callToAction1";
        this.callToActionQuestion1.type = QuestionTypeEnum.CALLTOACTION;
        const callToActionEnableWhen = new EnableWhen<boolean>();
        callToActionEnableWhen.questionId = this.question1.abbreviation;
        callToActionEnableWhen.answer = false;
        this.callToActionQuestion1.enableWhen = callToActionEnableWhen;

        //======================================= questionnaire
        this.questionnaire1.id = "qn1"
        this.questionnaire1.name = "Imundefekt alm"
        const frequency = new Frequency();
        frequency.days = [DayEnum.Monday, DayEnum.Wednesday];
        frequency.repeated = FrequencyEnum.WEEKLY;
        frequency.deadline = '11:00'
        this.questionnaire1.frequency = frequency;
        this.questionnaire1.status = BaseModelStatus.ACTIVE
        this.questionnaire1.lastUpdated = this.CreateDate();
        this.questionnaire1.version = "1"
        this.questionnaire1.questions = [this.question1, this.question2, this.question3, this.question4]

        this.questionnaire2.id = "qn2"
        this.questionnaire2.name = "Imundefekt medium"
        const frequency2 = new Frequency();
        frequency2.days = [DayEnum.Monday, DayEnum.Wednesday, DayEnum.Friday];
        frequency2.repeated = FrequencyEnum.WEEKLY;
        frequency2.deadline = '11:00'
        this.questionnaire2.frequency = frequency2;

        this.questionnaire3.id = "qn3"
        this.questionnaire3.name = "Imundefekt voldsom"
        const frequency3 = new Frequency();
        frequency3.days = [DayEnum.Monday, DayEnum.Tuesday, DayEnum.Wednesday, DayEnum.Thursday, DayEnum.Friday];
        frequency3.repeated = FrequencyEnum.WEEKLY;
        frequency3.deadline = '11:00'
        this.questionnaire3.frequency = frequency3;

        this.questionnaire4.id = "qn4"
        this.questionnaire4.name = "skema med gruppe spørgsmål"
        this.questionnaire4.frequency = frequency;
        this.questionnaire4.status = BaseModelStatus.ACTIVE
        this.questionnaire4.lastUpdated = this.CreateDate();
        this.questionnaire4.version = "1"
        this.questionnaire4.questions = [this.question2, this.groupQuestion]


        this.planDefinition1.name = "Infektionsmedicinsk patientgruppe"
        this.planDefinition1.id = "def1"
        this.planDefinition1.status = BaseModelStatus.ACTIVE
        this.planDefinition1.created = this.CreateDate();
        this.planDefinition1.questionnaires = [this.questionnaire1, this.questionnaire2, this.questionnaire3, this. questionnaire4]

        this.planDefinition2.name = "Molekylar medicinsk patientgruppe"
        this.planDefinition2.id = "def2"
        this.planDefinition2.status = BaseModelStatus.ACTIVE
        this.planDefinition2.questionnaires = [this.questionnaire3]

        this.allPlanDefinitions = [this.planDefinition1, this.planDefinition2];

        //====================================== Thresholds
        this.tc1.questionId = "q1";
        this.tc1.thresholdOptions = [
            this.CreateOption("1", "true", CategoryEnum.RED),
            this.CreateOption("2", "false", CategoryEnum.GREEN),
        ]



        this.tc2.questionId = "q2"
        this.tc2.thresholdNumbers = [
            this.CreateThreshold("1", 120, 135, CategoryEnum.RED),
            this.CreateThreshold("2", 37, 120, CategoryEnum.YELLOW),
            this.CreateThreshold("3", 0, 40, CategoryEnum.GREEN),

            //this.CreateThreshold("3", -10, 0, CategoryEnum.YELLOW),
            //this.CreateThreshold("3", -50, -10, CategoryEnum.RED),
        ]

        this.tc3.questionId = "q3"
        this.tc3.thresholdNumbers = [
            this.CreateThreshold("1", 0, 37, CategoryEnum.RED),
            this.CreateThreshold("2", 37, 44, CategoryEnum.YELLOW),
            this.CreateThreshold("3", 44, 100, CategoryEnum.GREEN),
        ]

        this.tc4.questionId = "q4";
        this.tc4.thresholdOptions = [
            this.CreateOption("1", "true", CategoryEnum.RED),
            this.CreateOption("2", "false", CategoryEnum.GREEN),
        ]

        this.tc5_sys.questionId = "q5_sys"
        this.tc5_sys.thresholdNumbers = [
            this.CreateThreshold("1", 0, 37, CategoryEnum.RED),
            this.CreateThreshold("2", 37, 44, CategoryEnum.YELLOW),
            this.CreateThreshold("3", 44, 100, CategoryEnum.GREEN),
        ]
        this.tc5_dia.questionId = "q5_dia"
        this.tc5_dia.thresholdNumbers = [
            this.CreateThreshold("1", 0, 37, CategoryEnum.RED),
            this.CreateThreshold("2", 37, 44, CategoryEnum.YELLOW),
            this.CreateThreshold("3", 44, 100, CategoryEnum.GREEN),
        ]

        this.questionnaire1.thresholds = [this.tc1, this.tc2, this.tc3, this.tc4]
        this.questionnaire2.thresholds = [this.tc1, this.tc2, this.tc3, this.tc4]
        this.questionnaire3.thresholds = [this.tc1, this.tc2, this.tc3, this.tc4]
        this.questionnaire4.thresholds = [this.tc2, this.tc5_sys, this.tc5_dia]
        //======================================= careplan
        this.careplan1.id = "plan1"
        this.careplan1.patient = this.patient1;
        this.careplan1.organization = new SimpleOrganization();
        this.careplan1.organization.name = "Infektionssygdomme";
        this.careplan1.planDefinitions = [this.planDefinition1, this.planDefinition2]
        this.careplan1.creationDate = this.CreateDate()
        this.careplan1.questionnaires = [this.questionnaire1, this.questionnaire2, this.questionnaire4]


        //======================================= careplan1
        this.careplan2.id = "plan2"
        this.careplan2.patient = this.patient1;
        this.careplan2.organization = new SimpleOrganization();
        this.careplan2.organization.name = "Infektionssygdomme";
        this.careplan2.planDefinitions = [this.planDefinition1]
        this.careplan2.creationDate = this.CreateDate()
        this.careplan2.terminationDate = this.CreateDate()
        this.careplan2.questionnaires = [this.questionnaire4]

        //======================================= Response // QuestionResponse1
        this.questionnaireResponse1.id = "qr1"
        this.questionnaireResponse1.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse1.patient = this.patient1;
        this.questionnaireResponse1.category = CategoryEnum.GREEN;
        this.questionnaireResponse1.answeredTime = this.CreateDate()
        this.questionnaireResponse1.status = QuestionnaireResponseStatus.NotProcessed;

        const questionAnswerMap1 = new Map<Question, Answer<any>>();
        questionAnswerMap1.set(this.question1, this.CreateStringAnswer(this.question1, this.questionnaire1.thresholds.find(x => x.questionId === this.question1.Id)!.thresholdOptions![0].option));
        questionAnswerMap1.set(this.question2, this.CreateNumberAnswer(this.question2, 37, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap1.set(this.question3, this.CreateNumberAnswer(this.question3, 50, UnitType.NOUNIT));
        questionAnswerMap1.set(this.question4, this.CreateBooleanAnswer(this.question4, false));
        questionAnswerMap1.set(this.groupQuestion, this.CreateGroupAnswer(this.groupQuestion));
        this.questionnaireResponse1.questions = questionAnswerMap1;


        //======================================= Response // QuestionResponse2
        this.questionnaireResponse2.id = "qr2"
        this.questionnaireResponse2.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse2.patient = this.patient1;
        this.questionnaireResponse2.category = CategoryEnum.RED;
        this.questionnaireResponse2.answeredTime = this.CreateDate()
        this.questionnaireResponse2.status = QuestionnaireResponseStatus.NotProcessed;

        const questionAnswerMap2 = new Map<Question, Answer<any>>();
        //  questionAnswerMap2.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId === this.question1.Id)!.thresholdOptions![0].option));
        questionAnswerMap2.set(this.question2, this.CreateNumberAnswer(this.question2, 35, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap2.set(this.question3, this.CreateNumberAnswer(this.question3, 10, UnitType.NOUNIT));
        questionAnswerMap2.set(this.question4, this.CreateBooleanAnswer(this.question4, true));
        this.questionnaireResponse2.questions = questionAnswerMap2;

        //======================================= Response // QuestionResponse3
        this.questionnaireResponse3.id = "qr3"
        this.questionnaireResponse3.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse3.patient = this.patient1;
        this.questionnaireResponse3.category = CategoryEnum.YELLOW;
        this.questionnaireResponse3.answeredTime = this.CreateDate()
        this.questionnaireResponse3.status = QuestionnaireResponseStatus.Processed;

        const questionAnswerMap3 = new Map<Question, Answer<any>>();
        // questionAnswerMap3.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId === this.question1.Id)!.thresholdOptions![1].option));
        questionAnswerMap3.set(this.question2, this.CreateNumberAnswer(this.question2, 37, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap3.set(this.question3, this.CreateNumberAnswer(this.question3, 90, UnitType.NOUNIT));
        questionAnswerMap3.set(this.question4, this.CreateBooleanAnswer(this.question4, true));
        this.questionnaireResponse3.questions = questionAnswerMap3;
        //======================================= Response // QuestionResponse4
        this.questionnaireResponse4.id = "qr4"
        this.questionnaireResponse4.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse4.patient = this.patient1;
        this.questionnaireResponse4.category = CategoryEnum.RED;
        this.questionnaireResponse4.answeredTime = this.CreateDate()
        this.questionnaireResponse4.status = QuestionnaireResponseStatus.Processed;

        const questionAnswerMap4 = new Map<Question, Answer<any>>();
        //questionAnswerMap4.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId === this.question1.Id)!.thresholdOptions![1].option));
        questionAnswerMap4.set(this.question2, this.CreateNumberAnswer(this.question2, 42, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap4.set(this.question3, this.CreateNumberAnswer(this.question3, 100, UnitType.NOUNIT));
        questionAnswerMap4.set(this.question4, this.CreateBooleanAnswer(this.question4, true));

        this.questionnaireResponse4.questions = questionAnswerMap4;
        //======================================= Response // QuestionResponse5
        this.questionnaireResponse5.id = "qr5"
        this.questionnaireResponse5.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse5.patient = this.patient1;
        this.questionnaireResponse5.category = CategoryEnum.RED;
        this.questionnaireResponse5.answeredTime = this.CreateDate()
        this.questionnaireResponse5.status = QuestionnaireResponseStatus.Processed;

        const questionAnswerMap5 = new Map<Question, Answer<any>>();
        //questionAnswerMap5.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId === this.question1.Id)!.thresholdOptions![0].option));
        questionAnswerMap5.set(this.question2, this.CreateNumberAnswer(this.question2, 44, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap5.set(this.question3, this.CreateNumberAnswer(this.question3, 50, UnitType.NOUNIT));
        questionAnswerMap5.set(this.question4, this.CreateBooleanAnswer(this.question4, true));
        this.questionnaireResponse5.questions = questionAnswerMap5;

        //======================================= Response // QuestionnaireResponseGroupQuestionnaire
        this.questionnaireResponseGroupQuestionnaire.id = "qr6"
        this.questionnaireResponseGroupQuestionnaire.questionnaireId = this.questionnaire4.id
        this.questionnaireResponseGroupQuestionnaire.patient = this.patient1;
        this.questionnaireResponseGroupQuestionnaire.category = CategoryEnum.RED;
        this.questionnaireResponseGroupQuestionnaire.answeredTime = this.CreateDate()
        this.questionnaireResponseGroupQuestionnaire.status = QuestionnaireResponseStatus.Processed;

        const questionAnswerMap6 = new Map<Question, Answer<any>>();
        //questionAnswerMap5.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId === this.question1.Id)!.thresholdOptions![0].option));
        questionAnswerMap6.set(this.question2, this.CreateNumberAnswer(this.question2, 44, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap6.set(this.groupQuestion, this.CreateGroupAnswer(this.groupQuestion));
        this.questionnaireResponseGroupQuestionnaire.questions = questionAnswerMap6;

        this.questionnaireResponseGroupQuestionnaire2.id = "qr6"
        this.questionnaireResponseGroupQuestionnaire2.questionnaireId = this.questionnaire4.id
        this.questionnaireResponseGroupQuestionnaire2.patient = this.patient1;
        this.questionnaireResponseGroupQuestionnaire2.category = CategoryEnum.RED;
        this.questionnaireResponseGroupQuestionnaire2.answeredTime = this.CreateDate()
        this.questionnaireResponseGroupQuestionnaire2.status = QuestionnaireResponseStatus.Processed;

        const questionAnswerMap7 = new Map<Question, Answer<any>>();
        //questionAnswerMap5.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId === this.question1.Id)!.thresholdOptions![0].option));
        questionAnswerMap7.set(this.question2, this.CreateNumberAnswer(this.question2, 40, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap7.set(this.groupQuestion, this.CreateGroupAnswer(this.groupQuestion));
        this.questionnaireResponseGroupQuestionnaire2.questions = questionAnswerMap7;


        //======================================= tasks
        this.task1.cpr = this.patient1.cpr!
        this.task1.planDefinitionName = this.planDefinition1.name
        this.task1.category = CategoryEnum.GREEN
        this.task1.firstname = this.patient1.firstname
        this.task1.lastname = this.patient1.lastname
        this.task1.questionnaireResponseStatus = this.questionnaireResponse1.status
        this.task1.questionnaireName = this.questionnaire1.name
        this.task1.questionnaireId = this.questionnaire1.id
        this.task1.answeredTime = this.CreateDate()
        this.task1.responseLinkEnabled = true

        this.task2.cpr = this.patient1.cpr!
        this.task2.planDefinitionName = this.planDefinition1.name
        this.task2.category = CategoryEnum.BLUE
        this.task2.firstname = this.patient1.firstname
        this.task2.lastname = this.patient1.lastname
        this.task2.questionnaireResponseStatus = this.questionnaireResponse1.status
        this.task2.questionnaireName = this.questionnaire1.name
        this.task2.questionnaireId = this.questionnaire1.id
        this.task2.responseLinkEnabled = true

        this.task3.cpr = this.patient1.cpr!
        this.task3.planDefinitionName = this.planDefinition1.name
        this.task3.category = CategoryEnum.RED
        this.task3.firstname = "jens"
        this.task3.lastname = "larsen"
        this.task3.questionnaireResponseStatus = this.questionnaireResponse1.status
        this.task3.questionnaireName = this.questionnaire1.name
        this.task3.questionnaireId = this.questionnaire1.id
        this.task3.responseLinkEnabled = true
    }
    async GetAllPlanDefinitionsForCarplan(statusesToInclude: (BaseModelStatus | PlanDefinitionStatus)[]): Promise<PlanDefinition[]> {
        const allplanDefinitions = await this.GetAllPlanDefinitions([])
        if (!allplanDefinitions)
            throw new NotFoundError()
        return allplanDefinitions;
    }
    async IsQuestionnaireInUse(questionnaireId: string): Promise<boolean> {
        return false;
    }
    async IsPlanDefinitionInUse(planDefinitionId: string): Promise<boolean> {
        return false;
    }
    async createPlanDefinition(planDefinition: PlanDefinition): Promise<void> {
        this.allPlanDefinitions.push(planDefinition);
    }
    async updatePlanDefinition(planDefinition: PlanDefinition): Promise<void> {
        const index = this.allPlanDefinitions.findIndex(x => x.id === planDefinition.id);
        this.allPlanDefinitions.splice(index, 1, planDefinition);
    }
    async createQuestionnaire(questionnaire: Questionnaire): Promise<void> {
        questionnaire.id = Date.now() + ""
        this.allQuestionnaires.push(questionnaire);
    }

    async GetAllMeasurementTypes(): Promise<MeasurementType[]> {
        try {


            let result = [
                this.toExternal.mapMeasurementType(this.measurementType1),
                this.toExternal.mapMeasurementType(this.measurementType2),
                this.toExternal.mapMeasurementType(this.measurementTypeSystolisk),
                this.toExternal.mapMeasurementType(this.measurementTypeDiastolisk)
            ]

            /*

            let measurementTypes: MeasurementType[]

            result.forEach(mt => {
                if( mt !== typeof undefined ){
                    measurementTypes.push(toInternal.mapMeasurementType(mt))
                }
            })
            return measurementTypes

            */
            //return result.filter(mt => mt !== typeof undefined).map(mt => toInternal.mapMeasurementType(mt))

            return result.map(mt => this.toInternal.mapMeasurementType(mt))


        } catch (error) {
            return this.HandleError(error)
        }
    }
    async GetPlanDefinitionById(planDefinitionId: string): Promise<PlanDefinition> {
        const allplanDefinitions = await this.GetAllPlanDefinitions([])
        const result = allplanDefinitions.find(x => x.id === planDefinitionId);
        if (!result)
            throw new NotFoundError()
        return result
    }

    async GetQuestionnaire(questionnaireId: string): Promise<Questionnaire | undefined> {
        return this.allQuestionnaires.find(x => x.id === questionnaireId)
    }
    async GetAllQuestionnaires(): Promise<Questionnaire[]> {
        return this.allQuestionnaires;
    }

    async updateQuestionnaire(questionnaire: Questionnaire): Promise<void> {
        const toChangeIndex = this.allQuestionnaires.findIndex(x => x.id === questionnaire.id);
        this.allQuestionnaires.splice(toChangeIndex, 1, questionnaire);
    }

    async IsPatientOnUnanswered(cpr: string): Promise<boolean> {
        return true;
    }

    async ResetPassword(patient: PatientDetail): Promise<void> {

    }
    async CreateUser(patient: PatientDetail): Promise<User> {
        throw new NotImplementedError();
    }
    async GetPatients(includeActive: boolean, includeCompconsted: boolean, page: number, pageSize: number): Promise<PatientDetail[]> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        const toReturn = [];
        for (let i = 0; i < pageSize; i++) {
            toReturn.push(this.patient1);
        }
        return toReturn;
    }

    async RemoveAlarm(task: Task): Promise<void> {
        this.taskRemovedFromMissingOverview.push(task)
    }

    async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number): Promise<PaginatedList<QuestionnaireResponse>> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        const responses = [
            this.questionnaireResponse1,
            this.questionnaireResponse2,
            this.questionnaireResponse3,
            this.questionnaireResponse4,
            this.questionnaireResponse5,
            this.questionnaireResponseGroupQuestionnaire,
            this.questionnaireResponseGroupQuestionnaire2]
        const start = (page - 1) * pagesize
        const end = page * pagesize
        responses.forEach(x => {
            const statusObject = this.statusChanges.reverse().find(y => y.id === x.id)
            x.status = statusObject?.status ?? x.status
        })

        return {
            limit: pagesize,
            offset: page,
            total: pagesize * page,
            list: responses.filter(x => questionnaireIds.includes(x.questionnaireId)).slice(start, end)
        }
    }

    async TerminateCareplan(_careplan: PatientCareplan): Promise<void> {
    }
    async SetQuestionnaire(_questionnaireEdit: Questionnaire): Promise<void> {
    }

    async EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        return patient;
    }
    async SearchPatient(searchstring: string): Promise<PatientDetail[]> {
        await new Promise(f => setTimeout(f, this.timeToWait));

        const allPatients = [this.patient1];

        let results: PatientDetail[] = [];
        const allPatientsWithFirstName: PatientDetail[] = allPatients.filter(x => x.firstname ? x.firstname.toLowerCase().includes(searchstring.toLowerCase()) : false)
        const allPatientsWithlastname: PatientDetail[] = allPatients.filter(x => x.lastname ? x.lastname.toLowerCase().includes(searchstring.toLowerCase()) : false)
        const allPatientsWithCPR: PatientDetail[] = allPatients.filter(x => x.cpr ? x.cpr.toLowerCase().includes(searchstring.toLowerCase()) : false)

        results = results.concat(allPatientsWithFirstName)
        results = results.concat(allPatientsWithlastname)
        results = results.concat(allPatientsWithCPR)

        return results;

    }

    async GetAllPlanDefinitions(statusesToInclude: (PlanDefinitionStatus | BaseModelStatus)[]): Promise<PlanDefinition[]> {
        try {
            if (statusesToInclude.length > 0)

                return this.allPlanDefinitions.filter(pd => statusesToInclude.includes(pd.status!));
            return this.allPlanDefinitions
        } catch (error: any) {
            return await this.HandleError(error);
        }
    }
    async AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        const questionnaireAlreadyInCareplan = careplan.questionnaires.find(x => x.id === questionnaireToAdd.id)
        if (questionnaireAlreadyInCareplan) {
            throw new QuestionnaireAlreadyOnCareplan();
        }

        careplan.questionnaires.push(questionnaireToAdd);
        return careplan;


    }

    async CreateCarePlan(carePlan: PatientCareplan): Promise<string> {
        try {
            await new Promise(f => setTimeout(f, this.timeToWait))
            return carePlan.id!
        } catch (error) {
            return await this.HandleError(error)
        }
    }

    async SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        return careplan;
    }

    statusChanges: Array<{ id: string, status: QuestionnaireResponseStatus }> = [];

    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus): Promise<QuestionnaireResponseStatus> {
        const allQuestionnaireResponses: QuestionnaireResponse[] = [this.questionnaireResponse1, this.questionnaireResponse2, this.questionnaireResponse3, this.questionnaireResponse4, this.questionnaireResponse5];
        await new Promise(f => setTimeout(f, this.timeToWait))
        this.statusChanges.push({ id: id, status: status })
        return status;
    }

    async CreatePatient(patient: PatientDetail): Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        throw new Error("Method not implemented.");
    }

    static date: Date = new Date()
    private CreateDate() {
        const days = 86400000 //number of milliseconds in a day
        FakeItToYouMakeItApi.date = new Date(FakeItToYouMakeItApi.date.getTime() - (1 * days))
        return FakeItToYouMakeItApi.date;
    }
    private CreateStringAnswer(question: Question, value: string) {
        const answer = new StringAnswer(question.Id!);
        answer.answer = value;
        return answer;
    }

    private CreateNumberAnswer(question: Question, value: number, unit: UnitType) {
        const answer = new NumberAnswer(question.Id!);
        answer.answer = value;
        answer.unit = unit;
        return answer;

    }
    private CreateBooleanAnswer(question: Question, value: boolean) {
        const answer = new BooleanAnswer(question.Id!);
        answer.answer = value;
        return answer;

    }
    private CreateGroupAnswer(groupQuestion: Question) {
        const answer = new GroupAnswer(groupQuestion.Id!);
        answer.questionId = groupQuestion.Id!
        answer.answer = [];
        groupQuestion.subQuestions?.map((sq, index) => {
            const sa = this.CreateNumberAnswer(sq, index,UnitType.NOUNIT);
            //sa.questionId = sq.Id!;

            answer.answer?.push(sa);
            
        })
        
        return answer;

    }
    private CreateOption(id: string, value: string, category: CategoryEnum): ThresholdOption {
        const option = new ThresholdOption();
        option.option = value;
        option.category = category;
        option.id = id
        return option;
    }

    private CreateThreshold(id: string, from: number, to: number, category: CategoryEnum): ThresholdNumber {
        const option = new ThresholdNumber();
        option.category = category;
        option.id = id
        option.to = to;
        option.from = from;
        return option;
    }

    private GetUniqueList(questionnaireresponses: QuestionnaireResponse[]): QuestionnaireResponse[] {
        const toReturn: QuestionnaireResponse[] = [];

        for (let i = 0; i < questionnaireresponses.length; i++) {
            const potential = questionnaireresponses[i];
            if (potential.status === QuestionnaireResponseStatus.Processed) {
                continue;
            }

            const existing = toReturn.find(a => a.patient.cpr === potential.patient.cpr)
            if (!existing) {
                toReturn.push(potential)
            }
        }
        return toReturn;
    }

    async throwError(statusCode: number): Promise<Response> {
        const body = JSON.stringify({
            "timestamp": "2022-01-11T13:31:21.337851392Z",
            "status": 400,
            "error": "Bad Request",
            "message": "Aktiv monitoreringsplan eksisterer allerede for det angivne cpr-nummer.",
            "path": "/api/v1/careplan",
            "errorCode": 10,
            "errorText": "Aktiv monitoreringsplan eksisterer allerede for det angivne cpr-nummer."
        });

        const standardResponse: Response = new Response(body, { status: statusCode });
        throw standardResponse;
    }
    async giveStringInPromise(message: string): Promise<string> {
        return message;
    }
    async GetUnfinishedQuestionnaireResponseTasks(page: number, pagesize: number): Promise<Array<Task>> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        try {
            if (page === 1)
                return [this.task1, this.task2, this.task3].filter(x => x.category !== CategoryEnum.BLUE)
            return []
        } catch (error) {
            return await this.HandleError(error)
        }

    }

    async GetUnansweredQuestionnaireTasks(page: number, pagesize: number): Promise<Array<Task>> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        return (await this.allCareplans.flatMap(x => this.toInternal.buildUnansweredTaskFromCarePlan(this.toExternal.mapCarePlan(x))))

        // if (page === 1)
        //     return [this.task1, this.task2, this.task3].filter(x => x.category === CategoryEnum.BLUE).filter(x => !this.taskRemovedFromMissingOverview.includes(x))
        //  return [];
    }

    async GetPatient(cpr: string): Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        if (this.patient1.cpr === cpr) {
            return this.patient1;
        }

        throw new NotFoundError();
    }

    async GetPerson(cpr: string): Promise<Person> {
        try {
            await new Promise(f => setTimeout(f, this.timeToWait));
            this.person1.cpr = cpr;
            return this.person1;
        } catch (error) {
            return await this.HandleError(error)
        }

    }

    async GetActiveUser(): Promise<User> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        const user = new User();
        user.userId = "TESTES";
        user.firstName = "Test";
        user.lastName = "Testsen";
        user.fullName = "Test Testsen";
        user.orgId = "453071000016001";
        user.orgName = "Infektionsmedicinsk Afdeling";
        user.email = "test@rm.dk"
        user.entitlements = ["Sygepljerske", "SOSU", "Administrator"];
        user.autorisationsids = [""];
        return user;
    }

    async GetPatientCareplans(cpr: string): Promise<PatientCareplan[]> {
        return [this.careplan1, this.careplan2]
            .map(x => this.toExternal.mapCarePlan(x))
            .map(x => this.toInternal.mapCarePlanDto(x))
            .filter(x => x.patient!.cpr === cpr);
    }

    async GetPatientCareplanById(id: string): Promise<PatientCareplan> {
        return [this.careplan1].find(x => x.id === id)!
    }

    async SetQuestionaireResponse(id: string, questionnaireResponses: QuestionnaireResponse): Promise<void> {

    }
    async SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber): Promise<void> {

    }
    async SetThresholdOption(thresholdId: string, threshold: ThresholdOption): Promise<void> {

    }
    async retireQuestionnaire(questionnaire: Questionnaire): Promise<void> {

    }
    async retirePlanDefinition(plandefinition: PlanDefinition): Promise<void> {

    }

    async GetUnresolvedQuestionnaires(careplanId: string): Promise<string[]> {
        return [this.questionnaire1.id]
    }

}
