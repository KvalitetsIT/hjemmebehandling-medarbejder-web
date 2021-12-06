import { Address } from "../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Contact } from "../components/Models/Contact";
import { Frequency, FrequencyEnum, DayEnum } from "../components/Models/Frequency";
import { PatientCareplan } from "../components/Models/PatientCareplan";
import { PatientDetail } from "../components/Models/PatientDetail";
import { PlanDefinition } from "../components/Models/PlanDefinition";
import { Question, QuestionTypeEnum } from "../components/Models/Question";
import { Questionnaire } from "../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../components/Models/QuestionnaireResponse";
import { Task } from "../components/Models/Task";
import { ThresholdNumber } from "../components/Models/ThresholdNumber";
import { ThresholdOption } from "../components/Models/ThresholdOption";

import { IBackendApi } from "./IBackendApi";

import { CarePlanApi } from "../generated/apis/CarePlanApi";
import { PersonApi } from "../generated/apis/PersonApi";
import { QuestionnaireResponseApi, GetQuestionnaireResponsesByStatusStatusEnum } from "../generated/apis/QuestionnaireResponseApi";

import { AnswerDto } from "../generated/models/AnswerDto";
import { CarePlanDto } from "../generated/models/CarePlanDto";
import { ContactDetailsDto } from "../generated/models/ContactDetailsDto";
import { FrequencyDto, FrequencyDtoWeekdaysEnum } from "../generated/models/FrequencyDto";
import { PatientDto } from "../generated/models/PatientDto";
import { PersonDto } from "../generated/models/PersonDto";
import { PlanDefinitionDto } from "../generated/models/PlanDefinitionDto";
import { QuestionDto, QuestionDtoQuestionTypeEnum } from "../generated/models/QuestionDto";
import { PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum } from "../generated/models/PartialUpdateQuestionnaireResponseRequest";
import { QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum } from "../generated/models/QuestionnaireResponseDto";
import { QuestionnaireWrapperDto } from "../generated/models/QuestionnaireWrapperDto";
import { Configuration, PlanDefinitionApi, ThresholdDto, ThresholdDtoTypeEnum, UserApi, UserContext } from "../generated";

import FhirUtils from "../util/FhirUtils";
import BaseApi from "./BaseApi";
import { FakeItToYouMakeItApi } from "./FakeItToYouMakeItApi";
import { ThresholdCollection } from "../components/Models/ThresholdCollection";
import { NotImplementedError } from "./Errors/NotImplementedError";

export class BffBackendApi extends BaseApi implements IBackendApi {
    GetPatients(includeActive: boolean, includeInactive: boolean,page : number, pageSize : number) : Promise<PatientDetail[]>{
        throw new NotImplementedError();
    }

    async RemoveAlarm(task: Task): Promise<void> {
        try {
            let api = new CarePlanApi(this.conf)
            let request = {
                id: FhirUtils.unqualifyId(task.carePlanId)
            }

            return await api.resolveAlarm(request)
        } catch(error: any) {
            return this.HandleError(error)
        }
    }

    conf : Configuration = new Configuration({ basePath: '/api/proxy' });

    TerminateCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        try{
            throw new NotImplementedError();
        } catch(error : any){
            return this.HandleError(error)
        }
        
    }
    SetQuestionnaire(questionnaireEdit: Questionnaire): Promise<void> {
        try{
            throw new NotImplementedError();
        } catch(error : any){
            return this.HandleError(error)
        }
    }
    EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        try{
            throw new NotImplementedError();
        } catch(error : any){
            return this.HandleError(error)
        }
    }
    SearchPatient(searchstring: string) : Promise<PatientDetail[]>{
        try{
            throw new NotImplementedError();
        } catch(error : any){
            return this.HandleError(error)
        }
    }
    
    async GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
        try{
            console.log('inside BffBackendApi.GetAllPlanDefinitions!')
    
            let api = new PlanDefinitionApi(this.conf)
            let planDefinitions = await api.getPlanDefinitions()
    
            return planDefinitions.map(pd => this.mapPlanDefinitionDto(pd))
        } catch(error : any){
            return this.HandleError(error)
        }
        
    }

    AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        try{
            throw new NotImplementedError();
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async CreateCarePlan(carePlan: PatientCareplan) : Promise<string> {
        try{
            let api = new CarePlanApi(this.conf)
            let request = {
                createCarePlanRequest: {
                    carePlan: this.mapCarePlan(carePlan)
                }
            }
    
            var response = await api.createCarePlanRaw(request)

            // Extract Location header, extract the id
            var location = response.raw.headers?.get('Location')
            if(!location) {
                throw new Error('No Location header in CreateCarePlan response!')
            }

            var parts = location.split('/')
            return parts[parts.length - 1]
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        try{
            throw new NotImplementedError();
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus) : Promise<void> {
        try{
            console.log('inside BffBackendApi.UpdateQuestionnaireResponseStatus!')
    
            let api = new QuestionnaireResponseApi(this.conf);
            let request = { id: FhirUtils.unqualifyId(id), partialUpdateQuestionnaireResponseRequest: { examinationStatus: this.mapQuestionnaireResponseStatus(status) } };
            await api.patchQuestionnaireResponse(request)
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async CreatePatient(patient: PatientDetail): Promise<PatientDetail> {
        try{
            throw new NotImplementedError();
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async GetUnfinishedQuestionnaireResponseTasks(page : number, pagesize : number) : Promise<Array<Task>> {
        try{
            let api = new QuestionnaireResponseApi(this.conf);
            let request = { 
                status: [GetQuestionnaireResponsesByStatusStatusEnum.NotExamined, GetQuestionnaireResponsesByStatusStatusEnum.UnderExamination],
                pageNumber: page,
                pageSize: pagesize
            };
    
            let questionnaireResponses = await api.getQuestionnaireResponsesByStatus(request);
    
            return questionnaireResponses.map(qr => this.buildTaskFromQuestionnaireResponse(qr))
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private buildTaskFromQuestionnaireResponse(questionnaireResponse: QuestionnaireResponseDto) : Task {
        try{
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
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async GetUnansweredQuestionnaireTasks(page : number, pagesize : number) : Promise<Array<Task>> {
        try {
            let api = new CarePlanApi(this.conf)
            let request = {
                onlyUnsatisfiedSchedules: true,
                onlyActiveCareplans: true,
                pageNumber: page,
                pageSize: pagesize
            }


            let carePlans = await api.searchCarePlans(request)

            return carePlans.map(cp => this.buildTaskFromCarePlan(cp))
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private buildTaskFromCarePlan(carePlan: CarePlanDto) : Task {
        try{
            let task = new Task()

            task.cpr = carePlan.patientDto!.cpr!
            task.category = CategoryEnum.BLUE
            task.firstname = carePlan.patientDto!.givenName
            task.lastname = carePlan.patientDto!.familyName
            task.questionnaireResponseStatus = undefined
            task.carePlanId = carePlan.id

            var questionnaire = carePlan.questionnaires![0].questionnaire!
            task.questionnaireId = questionnaire.id!
            task.questionnaireName = questionnaire.title!

            task.answeredTime = undefined
            task.responseLinkEnabled = false

            return task
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async GetPatient(cpr: string) : Promise<PatientDetail> {
        try{
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
                return new FakeItToYouMakeItApi().GetPatient(cpr);
            }
    
            // Map the body to a PatientDetail object
    
            var name = body['familyName'] + ', ' + body['givenName'];
            let patient : PatientDetail = new PatientDetail();
            patient.firstname = body['familyName'];
            patient.lastname = body['givenName'];
            patient.cpr = cpr;
    
            patient.address.country = "Danmark";
            patient.address.street = "Fiskergade 66";
            patient.address.zipCode = "8200 Aarhus C";
            patient.primaryPhone = body['patientContactDetails']['primaryPhone'];
    
            return patient;
        } catch(error : any){
            return this.HandleError(error)
        }
    }
    
    async GetPerson(cpr: string) : Promise<PersonDto> {
        try{
            let api = new PersonApi(this.conf);
            let request = { cpr: cpr };
            let person = await api.getPerson(request).catch(err => { console.log(err); throw err;});;
            return person;
        } catch(error : any){
            return this.HandleError(error)
        }
    }
    
    async GetUser() : Promise<UserContext> {
        try{
            let api = new UserApi(this.conf);
            let request = {};
            let user = await api.getUser(request).catch(err => { console.log(err); throw err;});;
            return user;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async GetPatientCareplans (cpr: string) : Promise<PatientCareplan[]>{
        try{
            console.log('Inside BffBackendApi.GetPatientCareplans !');
    
            // Retrieve the careplans
            let api = new CarePlanApi(this.conf);
            let request = {
                cpr: cpr,
                onlyActiveCareplans: true
            };
            let carePlans = await api.searchCarePlans(request);
            if(!carePlans) {
                throw new Error('Could not retrieve careplans!');
            }
            
            return carePlans.map(cp => this.mapCarePlanDto(cp));
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async GetPatientCareplanById(id: string) : Promise<PatientCareplan>{
        try {
            console.log('Inside BffBackendApi.GetPatientCareplanById !');

            // Retrieve the careplan
            let api = new CarePlanApi(this.conf);
            let carePlan = await api.getCarePlanById({id: id})
            if(!carePlan) {
                throw new Error('Could not retrieve careplan!');
            }

            return this.mapCarePlanDto(carePlan);
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number) : Promise<QuestionnaireResponse[]>{
        console.log("cp-id: "+careplanId);
        try{
            let api = new QuestionnaireResponseApi(this.conf)
            let request = { carePlanId: careplanId, questionnaireIds: questionnaireIds }
            let questionnaireResponses = await api.getQuestionnaireResponsesByCarePlanId(request)
    
            return questionnaireResponses.map(qr => this.mapQuestionnaireResponseDto(qr))
        } catch(error : any){
            return this.HandleError(error)
        }

    }

    async SetQuestionaireResponse(id: string, measurementCollection: QuestionnaireResponse) {
        try{
            return new FakeItToYouMakeItApi().SetQuestionaireResponse(id, measurementCollection);
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber){
        try{
            return await new FakeItToYouMakeItApi().SetThresholdNumber(thresholdId,threshold);
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    async SetThresholdOption(thresholdId: string, threshold: ThresholdOption){
        try{
            return await new FakeItToYouMakeItApi().SetThresholdOption(thresholdId,threshold);
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private getQuestionnaireIds(carePlanDtos: Array<CarePlanDto>) : Array<string> {
        try{
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
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapCarePlan(carePlan: PatientCareplan) : CarePlanDto {
        try{
            let carePlanDto = {
                id: "dummy",
                title: "Ny behandlingsplan", // TODO - set a title ...
                patientDto: this.mapPatient(carePlan.patient),
                questionnaires: carePlan.questionnaires.map(q => this.mapQuestionnaire(q)),
                planDefinitions: carePlan.planDefinitions.map(pd => this.mapPlanDefinition(pd))
            }
    
            return carePlanDto
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapCarePlanDto(carePlanDto: CarePlanDto) : PatientCareplan {
        try{
            let carePlan = new PatientCareplan();
    
            carePlan.id = FhirUtils.unqualifyId(carePlanDto.id);
            carePlan.planDefinitions = carePlanDto.planDefinitions!.map(pd => this.mapPlanDefinitionDto(pd))
            carePlan.questionnaires = carePlanDto?.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
            carePlan.patient = this.mapPatientDto(carePlanDto.patientDto!);
            carePlan.creationDate = new Date(); // TODO - include creation and termination date in the response ...
            //carePlan.terminationDate = undefined; // TODO
            carePlan.department = "Umuliologisk Afdeling"; // TODO - include Department in the api response ...
    
            return carePlan;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapPlanDefinition(planDefinition: PlanDefinition) : PlanDefinitionDto {
        try{
            return {
                id: planDefinition.id,
                name: planDefinition.name,
                questionnaires: planDefinition.questionnaires.map(q => this.mapQuestionnaire(q))
            }
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapPlanDefinitionDto(planDefinitionDto: PlanDefinitionDto) : PlanDefinition {
        try{
            let planDefinition = new PlanDefinition()
    
            planDefinition.id = planDefinitionDto.id!
            planDefinition.name = planDefinitionDto.title ?? "Titel mangler";
            planDefinition.questionnaires = planDefinitionDto.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
    
            return planDefinition
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapPatient(patient: PatientDetail) : PatientDto {
        try{
            return {
                cpr: patient.cpr,
                givenName: patient.firstname,
                familyName: patient.lastname,
                patientContactDetails : new Contact()
                //TODO : patientContactDetails: this.mapContactDetails(patient),
                //TODO : primaryRelativeContactDetails: this.mapContactDetails(patient)
            }
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapPatientDto(patientDto: PatientDto) : PatientDetail {
        try{
            let patient = new PatientDetail();
    
            patient.firstname = patientDto.givenName;
            patient.lastname = patientDto.familyName;
            patient.cpr = patientDto.cpr;
            //TODO : patient.patientContact = this.mapContactDetailsDto(patientDto.patientContactDetails!);
            patient.contact = this.mapContactDetailsDto(patientDto.primaryRelativeContactDetails!)
            // TODO - map additional contact details.
    
            return patient;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapContactDetails(contactDetails: Contact) : ContactDetailsDto {
        try{
            return {
                primaryPhone: contactDetails.primaryPhone,
                secondaryPhone: contactDetails.secondaryPhone,
            }
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapContactDetailsDto(patientContactDetails: ContactDetailsDto) : Contact {
        try{
            let contact = new Contact();
    
            let address = new Address();
            console.log('ContactDetails: ' + JSON.stringify(patientContactDetails));
            address.street = patientContactDetails?.street ?? 'Fiskergade 66';
            address.zipCode = patientContactDetails?.postalCode ?? '8000';
            address.city = "Aarhus";
            address.country = patientContactDetails?.country ?? 'Danmark';
    
            contact.primaryPhone = patientContactDetails?.primaryPhone ?? "12345678";
            contact.secondaryPhone = patientContactDetails?.secondaryPhone ?? "87654321";
    
            return contact;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapQuestionnaire(questionnaire: Questionnaire) : QuestionnaireWrapperDto {
        try{
            return { 
                questionnaire: {
                    id: questionnaire.id,
                    title: questionnaire.name
                },
                frequency: this.mapFrequency(questionnaire.frequency)
            }
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapQuestionnaireDto(wrapper: QuestionnaireWrapperDto) : Questionnaire {
        try{
            let questionnaire = new Questionnaire();
    
            questionnaire.id = FhirUtils.unqualifyId(wrapper.questionnaire!.id!)
            questionnaire.name = wrapper.questionnaire!.title!;
            questionnaire.frequency = this.mapFrequencyDto(wrapper.frequency!);
            questionnaire.thresholds = this.mapThresholdDtos(wrapper.thresholds!);
    
            return questionnaire;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapFrequency(frequency: Frequency) : FrequencyDto {
        try{
            return {
                weekdays: frequency.days.map(d => this.mapDayEnum(d)),
                timeOfDay: frequency.deadline
            }
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapFrequencyDto(frequencyDto: FrequencyDto) : Frequency {
        try{
            let frequency = new Frequency();
    
            frequency.repeated = FrequencyEnum.WEEKLY
            frequency.days = this.mapWeekdayDto(frequencyDto.weekdays!)
            frequency.deadline = frequencyDto.timeOfDay!
    
            return frequency;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapThresholdDtos(thresholdDtos: Array<ThresholdDto>) : Array<ThresholdCollection> {
        try{
            console.log(thresholdDtos)
            let thresholds: ThresholdCollection[] = [];
            
            
            for(var thresholdDto of thresholdDtos) {
                let threshold = thresholds.find(x=>x.questionId == thresholdDto.questionId);
                if (threshold === undefined) {
                    threshold = new ThresholdCollection();
                    threshold.questionId = thresholdDto.questionId!;
                    thresholds.push(threshold);
                }
                
                if (!(thresholdDto.valueBoolean === undefined)) {
                    console.log(threshold.questionId +"=thresholdOption")
                    let thresholdOption = this.CreateOption(
                        thresholdDto.questionId!,
                        String(thresholdDto.valueBoolean!),
                        this.mapTresholdCategory(thresholdDto.type!)
                    );
                    threshold.thresholdOptions!.push(thresholdOption);
                }
                else {
                    console.log(threshold.questionId +"=thresholdNumber")
                    let thresholdNumber = this.createThresholdNumber(
                        thresholdDto.questionId!,
                        Number(thresholdDto.valueQuantityLow),
                        Number(thresholdDto.valueQuantityHigh),
                        this.mapTresholdCategory(thresholdDto.type!)
                    );
                    threshold.thresholdNumbers!.push(thresholdNumber);
                }
            }
            console.log(thresholds)
            return thresholds;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapWeekday(weekday: DayEnum) : FrequencyDtoWeekdaysEnum {
        try{
            return FrequencyDtoWeekdaysEnum.Mon;
        } catch(error : any){
            return this.HandleError(error)
        }
    }

    private mapWeekdayDto(weekdays: FrequencyDtoWeekdaysEnum[]) : DayEnum[] {
        let dayEnums : DayEnum[] = [];
        for(var weekday of weekdays) {
            dayEnums.push( this.mapFrequencyDtoWeekdaysEnum(weekday) );
        }
        return dayEnums;
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
        if(questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Red){
	        response.category = CategoryEnum.RED; 
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Yellow){
	        response.category = CategoryEnum.YELLOW; 	
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Green){
	        response.category = CategoryEnum.GREEN; 	
        } else {
		    response.category = CategoryEnum.BLUE; 
        }
        response.patient = this.mapPatientDto(questionnaireResponseDto.patient!);

        return response;
    }

    private mapQuestionDto(questionDto: QuestionDto) : Question {
        let question = new Question();
        question.Id = questionDto.linkId!;
        
        switch(questionDto.questionType){
            case QuestionDtoQuestionTypeEnum.Choice: 
                question.type = QuestionTypeEnum.CHOICE;
            break;
            case QuestionDtoQuestionTypeEnum.Integer: 
                question.type = QuestionTypeEnum.INTEGER;
            break;
            case QuestionDtoQuestionTypeEnum.Quantity: 
                question.type = QuestionTypeEnum.OBSERVATION;
            break;
            case QuestionDtoQuestionTypeEnum.String: 
                question.type = QuestionTypeEnum.STRING;
            break;
        }

        question.question = questionDto.text!
        // TODO - handle options properly (there must be at least one option for the answer table to render).
        //TODO: question.options = [this.CreateOption("1", "placeholder", CategoryEnum.YELLOW)]

        return question;
    }

    private mapAnswerDto(answerDto: AnswerDto) : Answer {
        let answer: Answer = new StringAnswer();

        let value = answerDto.value!
        if(Number.parseFloat(value)) {
            let numberAnswer = new NumberAnswer()
            numberAnswer.answer = Number.parseFloat(value)
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

    private createThresholdNumber(id : string, valueLow : number, valueHigh : number, category : CategoryEnum) : ThresholdNumber {
        let number = new ThresholdNumber();
        number.from = valueLow;
        number.to = valueHigh;
        number.category = category;
        number.id = id
        return number;
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

    private mapTresholdCategory(category: ThresholdDtoTypeEnum) : CategoryEnum {
        switch(category) {
            case ThresholdDtoTypeEnum.Normal:
                return CategoryEnum.GREEN
            case ThresholdDtoTypeEnum.Abnormal:
                return CategoryEnum.YELLOW
            case ThresholdDtoTypeEnum.Critical:
                return CategoryEnum.RED
            default:
                throw new Error('Could not map category ' + category);
        }
    }

    private mapFrequencyDtoWeekdaysEnum(weekday: FrequencyDtoWeekdaysEnum) : DayEnum {
        switch(weekday) {
            case FrequencyDtoWeekdaysEnum.Mon:
                return DayEnum.Monday;
            case FrequencyDtoWeekdaysEnum.Tue:
                return DayEnum.Tuesday;
            case FrequencyDtoWeekdaysEnum.Wed:
                return DayEnum.Wednesday;
            case FrequencyDtoWeekdaysEnum.Thu:
                return DayEnum.Thursday;
            case FrequencyDtoWeekdaysEnum.Fri:
                return DayEnum.Friday;
            case FrequencyDtoWeekdaysEnum.Sat:
                return DayEnum.Saturday;
            case FrequencyDtoWeekdaysEnum.Sun:
                return DayEnum.Sunday;
            
            default:
                throw new Error('Could not map category ' + weekday);
        }
    }

    private mapDayEnum(day: DayEnum) : FrequencyDtoWeekdaysEnum {
        switch(day) {
            case DayEnum.Monday:
                return FrequencyDtoWeekdaysEnum.Mon
            case DayEnum.Tuesday:
                return FrequencyDtoWeekdaysEnum.Tue;
            case DayEnum.Wednesday:
                return FrequencyDtoWeekdaysEnum.Wed;
            case DayEnum.Thursday:
                return FrequencyDtoWeekdaysEnum.Thu;
            case DayEnum.Friday:
                return FrequencyDtoWeekdaysEnum.Fri;
            case DayEnum.Saturday:
                return FrequencyDtoWeekdaysEnum.Sat;
            case DayEnum.Sunday:
                return FrequencyDtoWeekdaysEnum.Sun;
            
            default:
                throw new Error('Could not map category ' + day);
        }
    }
}