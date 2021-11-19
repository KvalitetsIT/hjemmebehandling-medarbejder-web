import { Address } from "../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer, UnitType } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { Frequency, FrequencyEnum, DayEnum } from "../components/Models/Frequency";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { Person } from "../components/Models/Person";
import { Question } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { Task } from "../components/Models/Task";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";

import { IBackendApi } from "./IBackendApi";
import { MockedBackendApi } from "./MockedBackendApi";
import { FakeItToYouMakeItApi } from "./FakeItToYouMakeItApi";

import { CarePlanApi, GetCarePlansByCprRequest } from "../generated/apis/CarePlanApi";
import { PersonApi } from "../generated/apis/PersonApi";
import { QuestionnaireResponseApi, GetQuestionnaireResponsesByCarePlanIdRequest, GetQuestionnaireResponsesByStatusStatusEnum } from "../generated/apis/QuestionnaireResponseApi";

import { AnswerDto } from "../generated/models/AnswerDto";
import { CarePlanDto } from "../generated/models/CarePlanDto";
import { ContactDetailsDto } from "../generated/models/ContactDetailsDto";
import { FrequencyDto, FrequencyDtoWeekdayEnum } from "../generated/models/FrequencyDto";
import { PatientDto } from "../generated/models/PatientDto";
import { PersonDto } from "../generated/models/PersonDto";
import { PlanDefinitionDto } from "../generated/models/PlanDefinitionDto";
import { QuestionDto } from "../generated/models/QuestionDto";
import { PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum } from "../generated/models/PartialUpdateQuestionnaireResponseRequest";
import { QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum } from "../generated/models/QuestionnaireResponseDto";
import { QuestionnaireDto } from "../generated/models/QuestionnaireDto";
import { QuestionnaireWrapperDto } from "../generated/models/QuestionnaireWrapperDto";
import { Configuration, PlanDefinitionApi } from "../generated";

import FhirUtils from "../util/FhirUtils";

export class BffBackendApi implements IBackendApi {
    conf : Configuration = new Configuration({ basePath: '/api/proxy' });

    TerminateCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }
    SetQuestionnaire(questionnaireEdit: Questionnaire): Promise<void> {
        throw new Error("Method not implemented.");
    }
    EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        throw new Error("Method not implemented.");
    }
    SearchPatient(searchstring: string) : Promise<PatientDetail[]>{
        throw new Error("Method not implemented.");
    }
    
    async GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
        console.log('inside BffBackendApi.GetAllPlanDefinitions!')

        let api = new PlanDefinitionApi(this.conf)
        let planDefinitions = await api.getPlanDefinitions()

        return planDefinitions.map(pd => this.mapPlanDefinitionDto(pd))
    }

    AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }

    async CreateCarePlan(carePlan: PatientCareplan) : Promise<PatientCareplan> {
        let api = new CarePlanApi(this.conf)
        let request = {
            createCarePlanRequest: {
                carePlan: this.mapCarePlan(carePlan)
            }
        }

        await api.createCarePlan(request)

        return carePlan
    }

    SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        throw new Error("Method not implemented.");
    }

    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus) : Promise<void> {
        console.log('inside BffBackendApi.UpdateQuestionnaireResponseStatus!')

        let api = new QuestionnaireResponseApi(this.conf);
        let request = { id: FhirUtils.unqualifyId(id), partialUpdateQuestionnaireResponseRequest: { examinationStatus: this.mapQuestionnaireResponseStatus(status) } };
        await api.patchQuestionnaireResponse(request)
    }

    async CreatePatient(patient: PatientDetail): Promise<PatientDetail> {
        throw new Error("Method not implemented.");
    }

    async GetUnfinishedQuestionnaireResponseTasks(page : number, pagesize : number) : Promise<Array<Task>> {
        let api = new QuestionnaireResponseApi(this.conf);
        let request = { 
            status: [GetQuestionnaireResponsesByStatusStatusEnum.NotExamined, GetQuestionnaireResponsesByStatusStatusEnum.UnderExamination],
            pageNumber: page,
            pageSize: pagesize
        };

        let questionnaireResponses = await api.getQuestionnaireResponsesByStatus(request);

        return questionnaireResponses.map(qr => this.buildTaskFromQuestionnaireResponse(qr))
    }

    private buildTaskFromQuestionnaireResponse(questionnaireResponse: QuestionnaireResponseDto) : Task {
        let task = new Task()

        task.cpr = questionnaireResponse.patient!.cpr!
        task.category = this.mapTriagingCategory(questionnaireResponse.triagingCategory!)
        task.firstname = questionnaireResponse.patient!.givenName
        task.lastname = questionnaireResponse.patient!.familyName
        task.questionnaireResponseStatus = this.mapExaminationStatus(questionnaireResponse.examinationStatus!)
        task.questionnaireId = questionnaireResponse.questionnaireId!
        task.questionnaireName = questionnaireResponse.questionnaireName!
        task.answeredTime = questionnaireResponse.answered!
        task.responseLinkEnabled = true

        return task
    }

    async GetUnansweredQuestionnaireTasks(page : number, pagesize : number) : Promise<Array<Task>> {
        return []
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
        patientContact.fullname = name;
        patientContact.primaryPhone = body['patientContactDetails']['primaryPhone'];
        patient.patientContact = patientContact;

        return patient;
    }
    
    async GetPerson(cpr: string) : Promise<PersonDto> {
	
        let api = new PersonApi(this.conf);
	    let request = { cpr: cpr };
	    let person = await api.getPerson(request).catch(err => { console.log(err); throw err;});;
	    return person;
	
	    
	   // const response = await fetch("http://localhost:8080/api/v1/person?cpr="+cpr);
	   // const body = await response.json();
	    
       // let person = new Person();
	   //Object.assign(oldperson, person);
       // return person;
       
       //return oldperson;	
    }

    async GetPatientCareplans (cpr: string) : Promise<PatientCareplan[]>{
        console.log('Inside BffBackendApi.GetPatientCareplans !');

        // Retrieve the careplans
        let api = new CarePlanApi(this.conf);
        let request = { cpr: cpr };
        let carePlans = await api.getCarePlansByCpr(request);
        if(!carePlans) {
            throw new Error('Could not retrieve careplans!');
        }
        
        return carePlans.map(cp => this.mapCarePlanDto(cp));
    }

    async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number) : Promise<QuestionnaireResponse[]>{
        let api = new QuestionnaireResponseApi(this.conf)
        let request = { carePlanId: careplanId, questionnaireIds: questionnaireIds }
        let questionnaireResponses = await api.getQuestionnaireResponsesByCarePlanId(request)

        return questionnaireResponses.map(qr => this.mapQuestionnaireResponseDto(qr))
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

    private mapCarePlan(carePlan: PatientCareplan) : CarePlanDto {
        let carePlanDto = {
            id: "dummy",
            title: "Ny behandlingsplan", // TODO - set a title ...
            patientDto: this.mapPatient(carePlan.patient),
            questionnaires: carePlan.questionnaires.map(q => this.mapQuestionnaire(q)),
            planDefinitions: carePlan.planDefinitions.map(pd => this.mapPlanDefinition(pd))
        }

        return carePlanDto
    }

    private mapCarePlanDto(carePlanDto: CarePlanDto) : PatientCareplan {
        let carePlan = new PatientCareplan();

        carePlan.id = FhirUtils.unqualifyId(carePlanDto.id);
        carePlan.planDefinitions = carePlanDto.planDefinitions!.map(pd => this.mapPlanDefinitionDto(pd))
        carePlan.questionnaires = carePlanDto?.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
        carePlan.patient = this.mapPatientDto(carePlanDto.patientDto!);
        carePlan.creationDate = new Date(); // TODO - include creation and termination date in the response ...
        //carePlan.terminationDate = undefined; // TODO
        carePlan.department = "Umuliologisk Afdeling"; // TODO - include Department in the api response ...

        return carePlan;
    }

    private mapPlanDefinition(planDefinition: PlanDefinition) : PlanDefinitionDto {
        return {
            id: planDefinition.id,
            name: planDefinition.name,
            questionnaires: planDefinition.questionnaires.map(q => this.mapQuestionnaire(q))
        }
    }

    private mapPlanDefinitionDto(planDefinitionDto: PlanDefinitionDto) : PlanDefinition {
        let planDefinition = new PlanDefinition()

        planDefinition.id = planDefinitionDto.id!
        planDefinition.name = planDefinitionDto.title ?? "Titel mangler";
        planDefinition.questionnaires = planDefinitionDto.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []

        return planDefinition
    }

    private mapPatient(patient: PatientDetail) : PatientDto {
        return {
            cpr: patient.cpr,
            givenName: patient.firstname,
            familyName: patient.lastname,
            patientContactDetails: this.mapContactDetails(patient.patientContact),
            primaryRelativeContactDetails: this.mapContactDetails(patient.contact)
        }
    }

    private mapPatientDto(patientDto: PatientDto) : PatientDetail {
        let patient = new PatientDetail();

        patient.firstname = patientDto.givenName;
        patient.lastname = patientDto.familyName;
        patient.cpr = patientDto.cpr;
        patient.patientContact = this.mapContactDetailsDto(patientDto.patientContactDetails!);
        patient.contact = this.mapContactDetailsDto(patientDto.primaryRelativeContactDetails!)
        // TODO - map additional contact details.

        return patient;
    }

    private mapContactDetails(contactDetails: Contact) : ContactDetailsDto {
        return {
            street: contactDetails.address.road,
            postalCode: contactDetails.address.zipCode,
            country: contactDetails.address.country,
            city: contactDetails.address.city,
            primaryPhone: contactDetails.primaryPhone,
            secondaryPhone: contactDetails.secondaryPhone,
        }
    }

    private mapContactDetailsDto(patientContactDetails: ContactDetailsDto) : Contact {
        let contact = new Contact();

        let address = new Address();
        console.log('ContactDetails: ' + JSON.stringify(patientContactDetails));
        address.road = patientContactDetails?.street ?? 'Fiskergade 66';
        address.zipCode = patientContactDetails?.postalCode ?? '8000';
        address.city = "Aarhus";
        address.country = patientContactDetails?.country ?? 'Danmark';
        contact.address = address;

        contact.primaryPhone = patientContactDetails?.primaryPhone ?? "12345678";
        contact.secondaryPhone = patientContactDetails?.secondaryPhone ?? "87654321";

        return contact;
    }

    private mapQuestionnaire(questionnaire: Questionnaire) : QuestionnaireWrapperDto {
        return { 
            questionnaire: {
                id: questionnaire.id,
                title: questionnaire.name
            },
            frequency: this.mapFrequency(questionnaire.frequency)
        }
    }

    private mapQuestionnaireDto(wrapper: QuestionnaireWrapperDto) : Questionnaire {
        let questionnaire = new Questionnaire();

        questionnaire.id = FhirUtils.unqualifyId(wrapper.questionnaire!.id!)
        questionnaire.name = wrapper.questionnaire!.title!;
        questionnaire.frequency = this.mapFrequencyDto(wrapper.frequency!);

        return questionnaire;
    }

    private mapFrequency(frequency: Frequency) : FrequencyDto {
        return {
            weekday: this.mapWeekday(frequency.days[0]) // TODO - handle multiple days ...
        }
    }

    private mapFrequencyDto(frequencyDto: FrequencyDto) : Frequency {
        let frequency = new Frequency();

        frequency.repeated = FrequencyEnum.WEEKLY;
        frequency.days = [this.mapWeekdayDto(frequencyDto.weekday!)];

        return frequency;
    }

    private mapWeekday(weekday: DayEnum) : FrequencyDtoWeekdayEnum {
        return FrequencyDtoWeekdayEnum.Mon;
    }

    private mapWeekdayDto(weekday: FrequencyDtoWeekdayEnum) : DayEnum {
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
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.NotExamined
            case QuestionnaireResponseStatus.InProgress:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.UnderExamination
            case QuestionnaireResponseStatus.Processed:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.Examined
            default:
                throw new Error('Could not map QuestionnaireResponseStatus ' + status)
        }
    }

    private mapExaminationStatus(status: QuestionnaireResponseDtoExaminationStatusEnum) : QuestionnaireResponseStatus {
        switch(status) {
            case QuestionnaireResponseDtoExaminationStatusEnum.NotExamined:
                return QuestionnaireResponseStatus.NotProcessed
            case QuestionnaireResponseDtoExaminationStatusEnum.UnderExamination:
                return QuestionnaireResponseStatus.InProgress
            case QuestionnaireResponseDtoExaminationStatusEnum.Examined:
                return QuestionnaireResponseStatus.Processed
            default:
                throw new Error('Could not map ExaminationStatus ' + status)
        }
    }

    private mapTriagingCategory(category: QuestionnaireResponseDtoTriagingCategoryEnum) : CategoryEnum {
        switch(category) {
            case QuestionnaireResponseDtoTriagingCategoryEnum.Green:
                return CategoryEnum.GREEN
            case QuestionnaireResponseDtoTriagingCategoryEnum.Yellow:
                return CategoryEnum.YELLOW
            case QuestionnaireResponseDtoTriagingCategoryEnum.Red:
                return CategoryEnum.RED
            default:
                throw new Error('Could not map category ' + category);
        }
    } 
}