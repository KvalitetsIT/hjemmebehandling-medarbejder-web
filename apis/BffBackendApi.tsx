import { Address } from "../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer, UnitType } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { Frequency, FrequencyEnum, DayEnum } from "../components/Models/Frequency";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";

import { IBackendApi } from "./IBackendApi";
import { MockedBackendApi } from "./MockedBackendApi";
import { FakeItToYouMakeItApi } from "./FakeItToYouMakeItApi";

import { CarePlanApi, GetCarePlansByCprRequest } from "../generated/apis/CarePlanApi";
import { QuestionnaireResponseApi, GetQuestionnaireResponsesRequest } from "../generated/apis/QuestionnaireResponseApi";

import { AnswerDto } from "../generated/models/AnswerDto";
import { CarePlanDto } from "../generated/models/CarePlanDto";
import { ContactDetailsDto } from "../generated/models/ContactDetailsDto";
import { FrequencyDto, FrequencyDtoWeekdayEnum } from "../generated/models/FrequencyDto";
import { PatientDto } from "../generated/models/PatientDto";
import { QuestionDto } from "../generated/models/QuestionDto";
import { QuestionAnswerPairDto } from "../generated/models/QuestionAnswerPairDto";
import { QuestionnaireResponseDto } from "../generated/models/QuestionnaireResponseDto";
import { QuestionnaireWrapperDto } from "../generated/models/QuestionnaireWrapperDto";
import { Configuration } from "../generated";
import { PlanDefinition } from "../components/Models/PlanDefinition";

export class BffBackendApi implements IBackendApi {
    GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
        throw new Error("Method not implemented.");
    }
    AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }
    SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }
    async CreatePatient(patient: PatientDetail): Promise<PatientDetail> {
        throw new Error("Method not implemented.");
    }
    async GetTasklist(categories : Array<CategoryEnum>, page : number, pagesize : number) : Promise<Array<Questionnaire>> {
        return new MockedBackendApi().GetTasklist(categories, page, pagesize);
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

    async GetPatientCareplans (cpr: string) : Promise<PatientCareplan[]>{
        console.log('Inside BffBackendApi.GetPatientCareplans !');

        // Retrieve the careplans
        let conf : Configuration = new Configuration({ basePath: process.env.NEXT_PUBLIC_API_URL });
        let api = new CarePlanApi(conf);
        let request = { cpr: cpr };
        let carePlans = await api.getCarePlansByCpr(request);
        if(!carePlans) {
            throw new Error('Could not retrieve careplans!');
        }

        // Extract the questionnaire id's.
        let questionnaireIds = this.getQuestionnaireIds(carePlans);
        console.log('questionnaireIds: ' + JSON.stringify(questionnaireIds));

        // Retrieve responses for the questionnaires.
        let questionnaireResponses = await this.getQuestionnaireResponses(cpr, questionnaireIds);

        return carePlans.map(cp => this.mapCarePlanDto(cp, questionnaireResponses));
    }

    async SetQuestionaireResponse(id: string, measurementCollection: QuestionnaireResponse) {
        return new MockedBackendApi().SetQuestionaireResponse(id, measurementCollection);
    }

    async SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber){
        return await new MockedBackendApi().SetThresholdNumber(thresholdId,threshold);
    }

    async SetThresholdOption(thresholdId: string, threshold: ThresholdOption){
        return await new MockedBackendApi().SetThresholdOption(thresholdId,threshold);
    }

    private getQuestionnaireIds(carePlanDtos: Array<CarePlanDto>) : Array<string> {
        let questionnaireIds: string[] = [];

        for(var carePlanDto of carePlanDtos) {
            let ids = carePlanDto.questionnaires?.map(function(wrapper: QuestionnaireWrapperDto) {
                console.log('Extracting id from ' + JSON.stringify(wrapper));
                return wrapper.questionnaire?.id ?? '';
            }) ?? [];
            questionnaireIds = questionnaireIds.concat(ids);
        }
        console.log('Got questionnaireIds: ' + questionnaireIds);

        //return Array.from(new Set(questionnaireIds));
        return questionnaireIds;
    }

    private async getQuestionnaireResponses(cpr: string, questionnaireIds: Array<string>) : Promise<Map<string, Array<QuestionnaireResponse>>> {
        console.log('Inside BffBackendApi.getQuestionnaireResponses ! questionnaireIds: ' + questionnaireIds);

        let responses: Map<string, Array<QuestionnaireResponse>> = new Map<string, Array<QuestionnaireResponse>>();

        let api = new QuestionnaireResponseApi();
        let request = { cpr: cpr, questionnaireIds: questionnaireIds };
        let questionnaireResponses = await api.getQuestionnaireResponses(request);
        if(!questionnaireResponses) {
            throw new Error('Could not retrieve questionnaireResponses!');
        }
        console.log('questionnaireResponses: ' + JSON.stringify(questionnaireResponses));

        for(var response of questionnaireResponses) {
            console.log('Mapping response for ' + response.questionnaireId);
            // TODO - id's containing slashes must be handled properly!
            if(!responses.get(response.questionnaireId!.replace("Questionnaire/", ""))) {
                responses.set(response.questionnaireId!.replace("Questionnaire/", ""), []);
            }
            responses.get(response.questionnaireId!.replace("Questionnaire/", ""))!.push(this.mapQuestionnaireResponseDto(response));

        }

        return responses;
        //return new Map<string, Array<QuestionnaireResponse>>();
    }

    private mapCarePlanDto(carePlanDto: CarePlanDto, questionnaireResponses: Map<string, Array<QuestionnaireResponse>>) : PatientCareplan {
        let carePlan = new PatientCareplan();

        let planDefinition = { name: "plandefinition-1", id : "p1", questionnaires : [] };

        carePlan.id = carePlanDto.id;
        carePlan.planDefinitions = [planDefinition]; // TODO - PlanDefinition is not included in the api response ...
        carePlan.questionnaires = this.mapQuestionnaireDtos(carePlanDto.questionnaires!, questionnaireResponses)
        carePlan.patient = this.mapPatientDto(carePlanDto.patientDto!);
        carePlan.creationDate = new Date(); // TODO - include creation and termination date in the response ...
        //carePlan.terminationDate = undefined; // TODO
        carePlan.department = "Umuliologisk Afdeling"; // TODO - include Department in the api response ...

        return carePlan;
    }

    private mapPatientDto(patientDto: PatientDto) : PatientDetail {
        let patient = new PatientDetail();

        patient.firstname = patientDto.givenName;
        patient.lastname = patientDto.familyName;
        patient.cpr = patientDto.cpr;
        patient.patientContact = this.mapPatientContactDetails(patientDto.patientContactDetails!);
        // TODO - map additional contact details.

        return patient;
    }

    private mapPatientContactDetails(patientContactDetails: ContactDetailsDto) : Contact {
        let contact = new Contact();

        let address = new Address();
        console.log('ContactDetails: ' + JSON.stringify(patientContactDetails));
        address.road = patientContactDetails.street ?? 'Fiskergade 66';
        address.zipCode = patientContactDetails.postalCode ?? '8000';
        address.city = "Aarhus";
        address.country = patientContactDetails.country ?? 'Danmark';
        contact.address = address;

        contact.primaryPhone = patientContactDetails.primaryPhone!;
        contact.secondaryPhone = patientContactDetails.secondaryPhone!;
        contact.emailAddress = patientContactDetails.emailAddress!;

        return contact;
    }

    private mapQuestionnaireDtos(questionnaireDtos: Array<QuestionnaireWrapperDto>, questionnaireResponses: Map<string, Array<QuestionnaireResponse>>) : Array<Questionnaire> {
        let questionnaires = [];

        for(var wrapper of questionnaireDtos) {
            questionnaires.push(this.mapQuestionnaireDto(wrapper, questionnaireResponses));
        }

        return questionnaires;
    }

    private mapQuestionnaireDto(wrapper: QuestionnaireWrapperDto, questionnaireResponses: Map<string, Array<QuestionnaireResponse>>) : Questionnaire {
        let questionnaire = new Questionnaire();

        questionnaire.id = wrapper.questionnaire!.id!.replace("Questionnaire/", "");



        questionnaire.name = wrapper.questionnaire!.title!;
        questionnaire.frequency = this.mapFrequencyDto(wrapper.frequency!);

        let responses: QuestionnaireResponse[] = [];
        if(questionnaireResponses.get(questionnaire.id)) {
            console.log('Got questionnaireResponses: ' + questionnaireResponses.get(questionnaire.id));
            responses = questionnaireResponses?.get(questionnaire.id) ?? [];
        }
        questionnaire.questionnaireResponses = responses;

        return questionnaire;
    }

    private mapFrequencyDto(frequencyDto: FrequencyDto) : Frequency {
        let frequency = new Frequency();

        frequency.repeated = FrequencyEnum.WEEKLY;
        frequency.days = [this.mapWeekday(frequencyDto.weekday!)];

        return frequency;
    }

    private mapWeekday(weekday: FrequencyDtoWeekdayEnum) : DayEnum {
        return DayEnum.Monday;
    }

    private mapQuestionnaireResponseDto(questionnaireResponseDto: QuestionnaireResponseDto) : QuestionnaireResponse {
        let response = new QuestionnaireResponse();
        //let response = this.getQuestionnaireResponse();

        response.id = questionnaireResponseDto.id!;
        response.questions = new Map<Question, Answer>();

        for(var pair of questionnaireResponseDto.questionAnswerPairs!) {
            var question = this.mapQuestionDto(pair.question!);
            var answer = this.mapAnswerDto(pair.answer!);
            response.questions.set(question, answer);
        }

        response.answeredTime = questionnaireResponseDto.answered;
        response.status = QuestionnaireResponseStatus.NotProcessed;
        response.category = CategoryEnum.RED;
        response.patient = this.mapPatientDto(questionnaireResponseDto.patient!);

        return response;
    }

    private mapQuestionDto(questionDto: QuestionDto) : Question {
        let question = new Question();

        question.question = questionDto.text!
        // TODO - handle options properly (there must be at least one option for the answer table to render).
        question.options = [this.CreateOption("1", "placeholder", CategoryEnum.YELLOW)]

        return question;
    }

    private mapAnswerDto(answerDto: AnswerDto) : Answer {
        let answer: Answer = new StringAnswer();

        let value = answerDto.value!
        if(Number.parseInt(value)) {
            let numberAnswer = new NumberAnswer()
            numberAnswer.answer = Number.parseInt(value)
            answer = numberAnswer
        }
        else {
            let stringAnswer = new StringAnswer()
            stringAnswer.answer = value
            answer = stringAnswer
        }

        return answer;
    }

    private getQuestionnaireResponse() : QuestionnaireResponse {
        let question1 = new Question();
        question1.question = "Jeg har det bedre i dag"
        question1.options = [
            this.CreateOption("1", "Korekt", CategoryEnum.GREEN),
            this.CreateOption("2", "Ved ikke", CategoryEnum.YELLOW),
            this.CreateOption("3", "Ikke Korekt", CategoryEnum.RED),
        ]

        let question2 = new Question()
        question2.question = "Hvad er din temperatur idag?"
        question2.thresholdPoint = [
            this.CreateThreshold("1",44,100,CategoryEnum.RED),
            this.CreateThreshold("2",38,44,CategoryEnum.YELLOW),
            this.CreateThreshold("3",0,37,CategoryEnum.GREEN),
        ]

        let response1 = new QuestionnaireResponse();

        response1.id = "qr1"
        //response1.patient = this.patient1;
        response1.category = CategoryEnum.RED;
        response1.answeredTime = new Date();
        response1.status = QuestionnaireResponseStatus.NotProcessed;

        let questionAnswerMap1 = new Map<Question,Answer>();
        questionAnswerMap1.set(question1, this.CreateStringAnswer(question1.options[0].option));
        questionAnswerMap1.set(question2 ,this.CreateNumberAnswer(37, UnitType.DEGREASE_CELSIUS));
        response1.questions = questionAnswerMap1;

        return response1;
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
}