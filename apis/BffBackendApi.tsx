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
import { Person } from "../components/Models/Person";
import { User } from "../components/Models/User";
import PersonContact from "../components/Models/PersonContact";
import { ThresholdOption } from "../components/Models/ThresholdOption";
import ExternalToInternalMapper from "./Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "./Mappers/InternalToExternalMapper";

export class BffBackendApi extends BaseApi implements IBackendApi {

    conf: Configuration = new Configuration({ basePath: '/api/proxy' });
    
    toInternal: ExternalToInternalMapper;
    toExternal: InternalToExternalMapper;
    
    careplanApi = new CarePlanApi(this.conf)
    planDefinitionApi = new PlanDefinitionApi(this.conf)
    questionnaireResponseApi = new QuestionnaireResponseApi(this.conf);
    personApi = new PersonApi(this.conf);
    userApi = new UserApi(this.conf);
;

    constructor() {
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
    }
    async GetPatients(includeActive: boolean, page : number, pageSize : number) : Promise<PatientDetail[]>{
        try {
            let api = this.careplanApi
            let request = {
                onlyActiveCareplans: includeActive,
                pageNumber: page,
                pageSize: pageSize
            }


            let carePlans = await api.searchCarePlans(request)
            return carePlans.map(cp => this.toInternal.mapPatientDto(cp.patientDto!));
        } catch(error: any) {
            return await this.HandleError(error)
        }
    }

    async RemoveAlarm(task: Task): Promise<void> {
        try {
            let api = this.careplanApi
            let request = {
                id: FhirUtils.unqualifyId(task.carePlanId)
            }

            return await api.resolveAlarm(request)
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    

    async TerminateCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        try {
            let request = {
                id : careplan.id
            }
            await this.careplanApi.completeCarePlan(request)
            return careplan;
        } catch (error: any) {
            return await this.HandleError(error)
        }

    }
    async SetQuestionnaire(questionnaireEdit: Questionnaire): Promise<void> {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }
    async EditPatient(patient: PatientDetail): Promise<PatientDetail> {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }
    async SearchPatient(searchstring: string): Promise<PatientDetail[]> {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async GetAllPlanDefinitions(): Promise<PlanDefinition[]> {
        try {
            console.log('inside BffBackendApi.GetAllPlanDefinitions!')

            let api = this.planDefinitionApi;
            let planDefinitions = await api.getPlanDefinitions()

            return planDefinitions.map(pd => this.toInternal.mapPlanDefinitionDto(pd))
        } catch (error: any) {
            return await this.HandleError(error)
        }

    }

    async AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async CreateCarePlan(carePlan: PatientCareplan): Promise<string> {
        try {
            let api = this.careplanApi
            let request = {
                createCarePlanRequest: {
                    carePlan: this.toExternal.mapCarePlan(carePlan)
                }
            }

            var response = await api.createCarePlanRaw(request)

            // Extract Location header, extract the id
            var location = response.raw.headers?.get('Location')
            if (!location) {
                throw new Error('No Location header in CreateCarePlan response!')
            }

            var parts = location.split('/')
            return parts[parts.length - 1]
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus): Promise<QuestionnaireResponseStatus> {
        try {
            console.log('inside BffBackendApi.UpdateQuestionnaireResponseStatus!')

            let api = this.questionnaireResponseApi;
            let request = { id: FhirUtils.unqualifyId(id), partialUpdateQuestionnaireResponseRequest: { examinationStatus: this.toExternal.mapQuestionnaireResponseStatus(status) } };
            await api.patchQuestionnaireResponse(request)
            return status;
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async CreatePatient(patient: PatientDetail): Promise<PatientDetail> {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async GetUnfinishedQuestionnaireResponseTasks(page: number, pagesize: number): Promise<Array<Task>> {
        try {
            let api = this.questionnaireResponseApi;
            let request = {
                status: [GetQuestionnaireResponsesByStatusStatusEnum.NotExamined, GetQuestionnaireResponsesByStatusStatusEnum.UnderExamination],
                pageNumber: page,
                pageSize: pagesize
            };

            let questionnaireResponses = await api.getQuestionnaireResponsesByStatus(request);

            return questionnaireResponses.map(qr => this.toInternal.buildTaskFromQuestionnaireResponse(qr))
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async GetUnansweredQuestionnaireTasks(page: number, pagesize: number): Promise<Array<Task>> {
        try {
            let api = this.careplanApi
            let request = {
                onlyUnsatisfiedSchedules: true,
                onlyActiveCareplans: true,
                pageNumber: page,
                pageSize: pagesize
            }


            let carePlans = await api.searchCarePlans(request)

            return carePlans.map(cp => this.toInternal.buildTaskFromCarePlan(cp))
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }


    async GetPatient(cpr: string): Promise<PatientDetail> {
        try {
            var status = -1;
            var body = null;
            await fetch(
                'http://localhost:8080/api/v1/patient',
                {
                    'method': 'POST',
                    'body': '{"cpr": "' + cpr + '"}',
                    'headers': new Headers({ 'Content-Type': 'application/json' })
                })
                .then(res => res.json())
                .then(res => { body = res; });

            let patient: PatientDetail = new PatientDetail();
            if(body) {
                // Map the body to a PatientDetail object
                patient.firstname = body['familyName'];
                patient.lastname = body['givenName'];
                patient.cpr = cpr;
                patient.address = new Address();
                patient.address.country = "HardCodedCountry";
                patient.address.street = "HardCodedStreet";
                patient.address.zipCode = "HardcodedZip";
                patient.primaryPhone = body['patientContactDetails']['primaryPhone'];
            }
            return patient;
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async GetPerson(cpr: string): Promise<Person> {
        try {
            let api = this.personApi
            let request = { cpr: cpr };
            let person = await api.getPerson(request).catch(err => { console.log(err); throw err; });;
            return this.toInternal.mapPersonFromExternalToInternal(person);
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }


    async GetUser(): Promise<User> {
        try {
            let api = this.userApi;
            let request = {};
            let user = await api.getUser(request).catch(err => { console.log(err); throw err; });;
            return this.toInternal.mapUserFromExternalToInternal(user);
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async GetPatientCareplans(cpr: string): Promise<PatientCareplan[]> {
        try {
            console.log('Inside BffBackendApi.GetPatientCareplans !');

            // Retrieve the careplans
            let api = this.careplanApi;
            let request = {
                cpr: cpr,
                onlyActiveCareplans: true
            };
            let carePlans = await api.searchCarePlans(request);
            if (!carePlans) {
                throw new Error('Could not retrieve careplans!');
            }

            return carePlans.map(cp => this.toInternal.mapCarePlanDto(cp));
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async GetPatientCareplanById(id: string): Promise<PatientCareplan> {
        try {
            console.log('Inside BffBackendApi.GetPatientCareplanById !');

            // Retrieve the careplan
            let api = this.careplanApi;
            let carePlan = await api.getCarePlanById({ id: id })
            if (!carePlan) {
                throw new Error('Could not retrieve careplan!');
            }

            return this.toInternal.mapCarePlanDto(carePlan);
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], page: number, pagesize: number): Promise<QuestionnaireResponse[]> {
        console.log("cp-id: " + careplanId);
        try {
            let api = this.questionnaireResponseApi
            let request = { carePlanId: careplanId, questionnaireIds: questionnaireIds }
            let questionnaireResponses = await api.getQuestionnaireResponsesByCarePlanId(request)

            return questionnaireResponses.map(qr => this.toInternal.mapQuestionnaireResponseDto(qr))
        } catch (error: any) {
            return await  this.HandleError(error)
        }

    }

    async SetQuestionaireResponse(id: string, measurementCollection: QuestionnaireResponse) {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async SetThresholdNumber(thresholdId: string, threshold: ThresholdNumber) {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }

    async SetThresholdOption(thresholdId: string, threshold: ThresholdOption) {
        try {
            throw new NotImplementedError();
        } catch (error: any) {
            return await this.HandleError(error)
        }
    }
}


