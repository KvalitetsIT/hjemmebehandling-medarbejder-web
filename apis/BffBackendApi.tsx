import { Address } from "../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer, UnitType } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { Frequency, FrequencyEnum, DayEnum } from "../components/Models/Frequency";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PatientSimple } from "../components/Models/PatientSimple";
import { Person } from "../components/Models/Person";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";

import { IBackendApi } from "./IBackendApi";
import { MockedBackendApi } from "./MockedBackendApi";
import { FakeItToYouMakeItApi } from "./FakeItToYouMakeItApi";

import { CarePlanApi, GetCarePlansByCprRequest } from "../generated/apis/CarePlanApi";
import { QuestionnaireResponseApi, GetQuestionnaireResponsesByCprRequest } from "../generated/apis/QuestionnaireResponseApi";

import { AnswerDto } from "../generated/models/AnswerDto";
import { CarePlanDto } from "../generated/models/CarePlanDto";
import { ContactDetailsDto } from "../generated/models/ContactDetailsDto";
import { FrequencyDto, FrequencyDtoWeekdayEnum } from "../generated/models/FrequencyDto";
import { PatientDto } from "../generated/models/PatientDto";
import { QuestionDto } from "../generated/models/QuestionDto";
import { QuestionAnswerPairDto } from "../generated/models/QuestionAnswerPairDto";
import { PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum } from "../generated/models/PartialUpdateQuestionnaireResponseRequest";
import { QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum } from "../generated/models/QuestionnaireResponseDto";
import { QuestionnaireWrapperDto } from "../generated/models/QuestionnaireWrapperDto";
import { Configuration } from "../generated";
import { PlanDefinition } from "../components/Models/PlanDefinition";

export class BffBackendApi implements IBackendApi {
    EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        throw new Error("Method not implemented.");
    }
    SearchPatient(searchstring: string) : Promise<PatientDetail[]>{
        throw new Error("Method not implemented.");
    }
    
    GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
        return new FakeItToYouMakeItApi().GetAllPlanDefinitions();
    }
    AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }
    SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }

    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus) : Promise<void> {
        console.log('inside BffBackendApi.UpdateQuestionnaireResponseStatus!')

        let api = new QuestionnaireResponseApi();
        // TODO - solve the 'slash problem'!
        let request = { id: id.replace("QuestionnaireResponse/", ""), partialUpdateQuestionnaireResponseRequest: { examinationStatus: this.mapQuestionnaireResponseStatus(status) } };
        await api.patchQuestionnaireResponse(request)
    }

    async CreatePatient(patient: PatientDetail): Promise<PatientDetail> {
        throw new Error("Method not implemented.");
    }
    async GetTasklist(categories : Array<CategoryEnum>, page : number, pagesize : number) : Promise<Array<Questionnaire>> {
        return new MockedBackendApi().GetTasklist(categories, page, pagesize);
    }

    async GetUnfinishedQuestionnaireResponses(page : number, pagesize : number) : Promise<Array<Questionnaire>> {
        throw new Error("Method not implemented.");
    }

    async GetUnansweredQuestionnaires(page : number, pagesize : number) : Promise<Array<Questionnaire>> {
        throw new Error("Method not implemented.");
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
    
    async GetPerson(cpr: string) : Promise<Person> {
        return new MockedBackendApi().GetPerson(cpr);
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
        let questionnaireResponses = await api.getQuestionnaireResponsesByCpr(request);
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
        response.status = this.mapExaminationStatus(questionnaireResponseDto.examinationStatus!);
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

    private CreateOption(id : string, value : string,category : CategoryEnum) : ThresholdOption{
        let option = new ThresholdOption();
        option.option = value;
        option.category = category;
        option.id = id
        return option;
    }

    private mapQuestionnaireResponseStatus(status: QuestionnaireResponseStatus) : PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum {
        switch(status) {
            case QuestionnaireResponseStatus.NotProcessed:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.NotExamined;
            case QuestionnaireResponseStatus.InProgress:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.UnderExamination;
            case QuestionnaireResponseStatus.Processed:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.Examined;
            default:
                throw new Error('Could not map QuestionnaireResponseStatus ' + status);
        }
    }

    private mapExaminationStatus(status: QuestionnaireResponseDtoExaminationStatusEnum) : QuestionnaireResponseStatus {
        switch(status) {
            case QuestionnaireResponseDtoExaminationStatusEnum.NotExamined:
                return QuestionnaireResponseStatus.NotProcessed;
            case QuestionnaireResponseDtoExaminationStatusEnum.UnderExamination:
                return QuestionnaireResponseStatus.InProgress;
            case QuestionnaireResponseDtoExaminationStatusEnum.Examined:
                return QuestionnaireResponseStatus.Processed;
            default:
                throw new Error('Could not map ExaminationStatus ' + status);
        }
    }
}