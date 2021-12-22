import { Address } from "../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer, UnitType } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { DayEnum, Frequency, FrequencyEnum } from "../components/Models/Frequency";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { Person } from "../components/Models/Person";
import PersonContact from "../components/Models/PersonContact";
import { PatientSimple } from "../components/Models/PatientSimple";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { Question, QuestionTypeEnum } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { Task } from "../components/Models/Task";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";

import { QuestionnaireAlreadyOnCareplan } from "../services/Errors/QuestionnaireAlreadyOnCareplan";
import { IBackendApi } from "./IBackendApi";
import { UserContext } from "../generated";

import { BaseServiceError } from "../services/Errors/BaseServiceError";
import { BaseApiError } from "./Errors/BaseApiError";
import { NotFoundError } from "../services/Errors/NotFoundError";
import { ThresholdCollection } from "../components/Models/ThresholdCollection";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import { User } from "../components/Models/User";
import { QuestionnaireResponseStatusSelect } from "../components/Input/QuestionnaireResponseStatusSelect";
import BaseApi from "./BaseApi";
import { NotImplementedError } from "./Errors/NotImplementedError";

export class FakeItToYouMakeItApi extends BaseApi implements IBackendApi {

    timeToWait: number = 1000;

    taskRemovedFromMissingOverview: Task[] = [];
    patient1: PatientDetail = new PatientDetail();
    person1: Person = new Person();
    careplan1: PatientCareplan = new PatientCareplan();
    careplan2: PatientCareplan = new PatientCareplan();
    planDefinition1: PlanDefinition = new PlanDefinition();

    questionnaire1: Questionnaire = new Questionnaire();
    questionnaire2: Questionnaire = new Questionnaire();
    questionnaire3: Questionnaire = new Questionnaire();

    //Response1
    questionnaireResponse1: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse2: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse3: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse4: QuestionnaireResponse = new QuestionnaireResponse();
    questionnaireResponse5: QuestionnaireResponse = new QuestionnaireResponse();
    question1: Question = new Question();
    question2: Question = new Question();
    question3: Question = new Question();

    tc1 = new ThresholdCollection();
    tc2 = new ThresholdCollection();
    tc3 = new ThresholdCollection();

    task1: Task = new Task();
    task2: Task = new Task();

    constructor() {
        super();
        //======================================= Patient
        this.patient1.cpr = "1212758392";
        this.patient1.firstname = "Jens"
        this.patient1.lastname = "Petersen"
        this.patient1.username= "JENPET" //Username is 6 chars
        this.patient1.primaryPhone = "29483749"
        this.patient1.address = new Address();
        this.patient1.address.city = "Aarhus C"
        this.patient1.address.country = "Danmark"
        this.patient1.address.street = "Fiskergade 66"
        this.patient1.address.zipCode = "8000"

        let relativeContact = new Contact();
        relativeContact.fullname = "Johanne Petersen"
        relativeContact.affiliation = "Kone"
        relativeContact.primaryPhone = "27384910"
        this.patient1.contact = relativeContact;

        this.person1.cpr = "2512489996"
        this.person1.givenName = "Nancy Ann"
        this.person1.familyName = "Berggren"
        let personContact = new PersonContact();
        personContact.city = "Aarhus C";
        personContact.postalCode = "8000";
        personContact.street = "Fiskergade 66"
        personContact.primaryPhone = "29483749"

        this.person1.patientContactDetails = personContact;

        this.planDefinition1.name = "Imundefekt"
        this.planDefinition1.id = "def1"
        //======================================= Questions
        this.question1.Id = "q1";
        this.question1.question = "Jeg har det bedre i dag"
        this.question1.type = QuestionTypeEnum.CHOICE;

        this.question2.Id = "q2";
        this.question2.question = "Hvad er din temperatur idag?"
        this.question2.type = QuestionTypeEnum.OBSERVATION;

        this.question3.Id = "q3";
        this.question3.question = "Hvor frisk føler du dig i dag (Fra 0-100, hvor 100 er det højeste)?"
        this.question3.type = QuestionTypeEnum.INTEGER;

        //======================================= questionnaire
        this.questionnaire1.id = "qn1"
        this.questionnaire1.name = "Imundefekt alm"
        let frequency = new Frequency();
        frequency.days = [DayEnum.Monday, DayEnum.Wednesday];
        frequency.repeated = FrequencyEnum.WEEKLY;
        frequency.deadline = '11:00'
        this.questionnaire1.frequency = frequency;
        this.questionnaire1.thresholds = [this.tc1, this.tc2, this.tc3]


        this.questionnaire2.id = "qn2"
        this.questionnaire2.name = "Imundefekt medium"
        let frequency2 = new Frequency();
        frequency2.days = [DayEnum.Monday, DayEnum.Wednesday, DayEnum.Friday];
        frequency2.repeated = FrequencyEnum.WEEKLY;
        frequency2.deadline = '11:00'
        this.questionnaire2.frequency = frequency2;

        this.questionnaire3.id = "qn3"
        this.questionnaire3.name = "Imundefekt voldsom"
        let frequency3 = new Frequency();
        frequency3.days = [DayEnum.Monday, DayEnum.Tuesday, DayEnum.Wednesday, DayEnum.Thursday, DayEnum.Friday];
        frequency3.repeated = FrequencyEnum.WEEKLY;
        frequency3.deadline = '11:00'
        this.questionnaire3.frequency = frequency3;


        this.planDefinition1.name = "Imundefekt"
        this.planDefinition1.id = "def1"

        this.planDefinition1.questionnaires = [this.questionnaire1, this.questionnaire2]

        //====================================== Thresholds
        this.tc1.questionId = "q1";
        this.tc1.thresholdOptions = [
            this.CreateOption("1", "Korekt", CategoryEnum.GREEN),
            this.CreateOption("2", "Ved ikke", CategoryEnum.YELLOW),
            this.CreateOption("3", "Ikke Korekt", CategoryEnum.RED),
        ]

        this.tc2.questionId = "q2"
        this.tc2.thresholdNumbers = [
            this.CreateThreshold("1", 120, 135, CategoryEnum.RED),
            this.CreateThreshold("2", 37, 120, CategoryEnum.YELLOW),
            this.CreateThreshold("3", 0, 37, CategoryEnum.GREEN),
        ]

        this.tc3.questionId = "q3"
        this.tc3.thresholdNumbers = [
            this.CreateThreshold("1", 0, 37, CategoryEnum.RED),
            this.CreateThreshold("2", 37, 44, CategoryEnum.YELLOW),
            this.CreateThreshold("3", 44, 100, CategoryEnum.GREEN),
        ]
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

        //======================================= Response // QuestionResponse1
        this.questionnaireResponse1.id = "qr1"
        this.questionnaireResponse1.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse1.patient = this.patient1;
        this.questionnaireResponse1.category = CategoryEnum.GREEN;
        this.questionnaireResponse1.answeredTime = this.CreateDate()
        this.questionnaireResponse1.status = QuestionnaireResponseStatus.NotProcessed;

        let questionAnswerMap1 = new Map<Question, Answer>();
        questionAnswerMap1.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId == this.question1.Id)!.thresholdOptions![0].option));
        questionAnswerMap1.set(this.question2, this.CreateNumberAnswer(37, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap1.set(this.question3, this.CreateNumberAnswer(50, UnitType.NOUNIT));
        this.questionnaireResponse1.questions = questionAnswerMap1;


        //======================================= Response // QuestionResponse2
        this.questionnaireResponse2.id = "qr2"
        this.questionnaireResponse2.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse2.patient = this.patient1;
        this.questionnaireResponse2.category = CategoryEnum.RED;
        this.questionnaireResponse2.answeredTime = this.CreateDate()
        this.questionnaireResponse2.status = QuestionnaireResponseStatus.NotProcessed;

        let questionAnswerMap2 = new Map<Question, Answer>();
        questionAnswerMap2.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId == this.question1.Id)!.thresholdOptions![0].option));
        questionAnswerMap2.set(this.question2, this.CreateNumberAnswer(35, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap2.set(this.question3, this.CreateNumberAnswer(10, UnitType.NOUNIT));
        this.questionnaireResponse2.questions = questionAnswerMap2;

        //======================================= Response // QuestionResponse3
        this.questionnaireResponse3.id = "qr3"
        this.questionnaireResponse3.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse3.patient = this.patient1;
        this.questionnaireResponse3.category = CategoryEnum.YELLOW;
        this.questionnaireResponse3.answeredTime = this.CreateDate()
        this.questionnaireResponse3.status = QuestionnaireResponseStatus.Processed;

        let questionAnswerMap3 = new Map<Question, Answer>();
        questionAnswerMap3.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId == this.question1.Id)!.thresholdOptions![1].option));
        questionAnswerMap3.set(this.question2, this.CreateNumberAnswer(37, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap3.set(this.question3, this.CreateNumberAnswer(90, UnitType.NOUNIT));
        this.questionnaireResponse3.questions = questionAnswerMap3;
        //======================================= Response // QuestionResponse4
        this.questionnaireResponse4.id = "qr4"
        this.questionnaireResponse4.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse4.patient = this.patient1;
        this.questionnaireResponse4.category = CategoryEnum.RED;
        this.questionnaireResponse4.answeredTime = this.CreateDate()
        this.questionnaireResponse4.status = QuestionnaireResponseStatus.Processed;

        let questionAnswerMap4 = new Map<Question, Answer>();
        questionAnswerMap4.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId == this.question1.Id)!.thresholdOptions![2].option));
        questionAnswerMap4.set(this.question2, this.CreateNumberAnswer(42, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap4.set(this.question3, this.CreateNumberAnswer(100, UnitType.NOUNIT));
        this.questionnaireResponse4.questions = questionAnswerMap4;
        //======================================= Response // QuestionResponse5
        this.questionnaireResponse5.id = "qr5"
        this.questionnaireResponse5.questionnaireId = this.questionnaire1.id
        this.questionnaireResponse5.patient = this.patient1;
        this.questionnaireResponse5.category = CategoryEnum.RED;
        this.questionnaireResponse5.answeredTime = this.CreateDate()
        this.questionnaireResponse5.status = QuestionnaireResponseStatus.Processed;

        let questionAnswerMap5 = new Map<Question, Answer>();
        questionAnswerMap5.set(this.question1, this.CreateStringAnswer(this.questionnaire1.thresholds.find(x => x.questionId == this.question1.Id)!.thresholdOptions![2].option));
        questionAnswerMap5.set(this.question2, this.CreateNumberAnswer(44, UnitType.DEGREASE_CELSIUS));
        questionAnswerMap5.set(this.question3, this.CreateNumberAnswer(50, UnitType.NOUNIT));
        this.questionnaireResponse5.questions = questionAnswerMap5;


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
    }
    async ResetPassword(patient: PatientDetail): Promise<void> {
        throw new NotImplementedError();
    }
    async CreateUser(patient: PatientDetail): Promise<User> {
        throw new NotImplementedError();
    }
    async GetPatients(includeActive: boolean, page: number, pageSize: number): Promise<PatientDetail[]> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        let toReturn = [];
        for (let i = 0; i < pageSize; i++) {
            toReturn.push(this.patient1);
        }
        return toReturn;
    }

    async RemoveAlarm(task: Task): Promise<void> {
        this.taskRemovedFromMissingOverview.push(task)
    }

    async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number): Promise<QuestionnaireResponse[]> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        let responses = [this.questionnaireResponse1, this.questionnaireResponse2, this.questionnaireResponse3, this.questionnaireResponse4, this.questionnaireResponse5]
        let start = (page - 1) * pagesize
        let end = page * pagesize
        responses.forEach(x => {
            const statusObject = this.statusChanges.reverse().find(y => y.id == x.id)
            x.status = statusObject?.status ?? x.status
        })
        return responses.filter(x => questionnaireIds.includes(x.questionnaireId)).slice(start, end)
    }

    async TerminateCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        throw new NotImplementedError();
    }
    async SetQuestionnaire(questionnaireEdit: Questionnaire): Promise<void> {
    }

    async EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        return patient;
    }
    async SearchPatient(searchstring: string): Promise<PatientDetail[]> {
        await new Promise(f => setTimeout(f, this.timeToWait));

        let allPatients = [this.patient1];

        let results: PatientDetail[] = [];
        let allPatientsWithFirstName: PatientDetail[] = allPatients.filter(x => x.firstname ? x.firstname.toLowerCase().includes(searchstring.toLowerCase()) : false)
        let allPatientsWithlastname: PatientDetail[] = allPatients.filter(x => x.lastname ? x.lastname.toLowerCase().includes(searchstring.toLowerCase()) : false)
        let allPatientsWithCPR: PatientDetail[] = allPatients.filter(x => x.cpr ? x.cpr.toLowerCase().includes(searchstring.toLowerCase()) : false)

        results = results.concat(allPatientsWithFirstName)
        results = results.concat(allPatientsWithlastname)
        results = results.concat(allPatientsWithCPR)

        return results;

    }

    async GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
        return [this.planDefinition1]
    }
    async AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        let questionnaireAlreadyInCareplan = careplan.questionnaires.find(x => x.id == questionnaireToAdd.id)
        if (questionnaireAlreadyInCareplan) {
            throw new QuestionnaireAlreadyOnCareplan();
        }

        careplan.questionnaires.push(questionnaireToAdd);
        return careplan;


    }

    async CreateCarePlan(carePlan: PatientCareplan): Promise<string> {
        try {
            await new Promise(f => setTimeout(f, this.timeToWait))
        return carePlan.id
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
        let allQuestionnaireResponses: QuestionnaireResponse[] = [this.questionnaireResponse1, this.questionnaireResponse2, this.questionnaireResponse3, this.questionnaireResponse4, this.questionnaireResponse5];
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
        let days = 86400000 //number of milliseconds in a day
        FakeItToYouMakeItApi.date = new Date(FakeItToYouMakeItApi.date.getTime() - (1 * days))
        return FakeItToYouMakeItApi.date;
    }
    private CreateStringAnswer(value: string) {
        let answer = new StringAnswer();
        answer.answer = value;
        return answer;
    }

    private CreateNumberAnswer(value: number, unit: UnitType) {
        let answer = new NumberAnswer();
        answer.answer = value;
        answer.unit = unit;
        return answer;

    }
    private CreateOption(id: string, value: string, category: CategoryEnum): ThresholdOption {
        let option = new ThresholdOption();
        option.option = value;
        option.category = category;
        option.id = id
        return option;
    }

    private CreateThreshold(id: string, from: number, to: number, category: CategoryEnum): ThresholdNumber {
        let option = new ThresholdNumber();
        option.category = category;
        option.id = id
        option.to = to;
        option.from = from;
        return option;
    }

    private GetUniqueList(questionnaireresponses: QuestionnaireResponse[]): QuestionnaireResponse[] {
        let toReturn: QuestionnaireResponse[] = [];

        for (let i = 0; i < questionnaireresponses.length; i++) {
            let potential = questionnaireresponses[i];
            if (potential.status == QuestionnaireResponseStatus.Processed) {
                continue;
            }

            let existing = toReturn.find(a => a.patient.cpr == potential.patient.cpr)
            if (!existing) {
                toReturn.push(potential)
            }
        }
        return toReturn;
    }

    async throwError(statusCode: number): Promise<Response> {
        let standardResponse: Response = new Response(null, { status: statusCode });
        throw standardResponse;
    }

    async GetUnfinishedQuestionnaireResponseTasks(page: number, pagesize: number): Promise<Array<Task>> {
        try {

            return [this.task1, this.task2].filter(x => x.category != CategoryEnum.BLUE)
        } catch (error) {
            return await this.HandleError(error)
        }

    }

    async GetUnansweredQuestionnaireTasks(page: number, pagesize: number): Promise<Array<Task>> {
        return [this.task1, this.task2].filter(x => x.category == CategoryEnum.BLUE).filter(x => !this.taskRemovedFromMissingOverview.includes(x))
    }

    async GetPatient(cpr: string): Promise<PatientDetail> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        if (this.patient1.cpr == cpr) {
            return this.patient1;
        }

        throw new NotFoundError();
    }

    async GetPerson(cpr: string): Promise<Person> {
        try {
            await new Promise(f => setTimeout(f, this.timeToWait));
            return this.person1;
        } catch (error) {
            return await this.HandleError(error)
        }

    }

    async GetActiveUser(): Promise<User> {
        await new Promise(f => setTimeout(f, this.timeToWait));
        let user = new User();
        user.userId = "TESTES";
        user.firstName = "Test";
        user.lastName = "Testsen";
        user.fullName = "Test Testsen";
        user.orgId = "453071000016001";
        user.orgName = "Infektionsmedicinsk Afdeling";
        user.email = "test@rm.dk"
        user.entitlements = ["DIAS_HJEMMEBEHANDLING_Sygeplejerske"];
        user.autorisationsids = [""];
        return user;
    }

    async GetPatientCareplans(cpr: string): Promise<PatientCareplan[]> {

        return [this.careplan1, this.careplan2].filter(x => x.patient.cpr == cpr);
    }

    async GetPatientCareplanById(id: string): Promise<PatientCareplan> {
        return this.careplan1
    }

    async SetQuestionaireResponse(id: string, questionnaireResponses: QuestionnaireResponse): Promise<void> {

    }
    async SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber): Promise<void> {

    }
    async SetThresholdOption(thresholdId: string, threshold: ThresholdOption): Promise<void> {

    }

}