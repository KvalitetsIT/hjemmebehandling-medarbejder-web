import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PlanDefinition, PlanDefinitionStatus } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";

import { IBackendApi } from "./interfaces/IBackendApi";

import { CarePlanApi, GetUnresolvedQuestionnairesRequest } from "../generated/apis/CarePlanApi";
import { PersonApi } from "../generated/apis/PersonApi";
import { QuestionnaireResponseApi, GetQuestionnaireResponsesByStatusStatusEnum } from "../generated/apis/QuestionnaireResponseApi";

import { Configuration, CreatePlanDefinitionOperationRequest, CreateQuestionnaireOperationRequest, GetPlanDefinitionsRequest, GetQuestionnairesRequest, IsPlanDefinitionInUseRequest, IsQuestionnaireInUseRequest, PatchPlanDefinitionOperationRequest, PatchPlanDefinitionRequestStatusEnum, PatchQuestionnaireOperationRequest, PatientApi, PlanDefinitionApi, QuestionnaireApi, ThresholdDto, UserApi } from "../generated";

import FhirUtils from "../util/FhirUtils";
import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";

import { NotImplementedError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ApiErrors/NotImplementedError";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";
import ExternalToInternalMapper from "./Mappers/ExternalToInternalMapper";
import InternalToExternalMapper from "./Mappers/InternalToExternalMapper";
import { NotFoundError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/NotFoundError";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { ValueSetApi } from "../generated/apis/ValueSetApi";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { PrimaryContact } from "@kvalitetsit/hjemmebehandling/Models/PrimaryContact";
import { PaginatedList } from "@kvalitetsit/hjemmebehandling/Models/PaginatedList";

export class BffBackendApi extends BaseApi implements IBackendApi {

    conf: Configuration = new Configuration({ basePath: '/api/proxy' });

    toInternal: ExternalToInternalMapper;
    toExternal: InternalToExternalMapper;

    careplanApi = new CarePlanApi(this.conf)
    planDefinitionApi = new PlanDefinitionApi(this.conf)
    questionnaireResponseApi = new QuestionnaireResponseApi(this.conf);
    personApi = new PersonApi(this.conf);
    userApi = new UserApi(this.conf);
    patientApi = new PatientApi(this.conf);
    questionnaireApi = new QuestionnaireApi(this.conf);
    valueSetApi = new ValueSetApi(this.conf);

    constructor() {
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
    }

    
    async createPlanDefinition(planDefinition: PlanDefinition): Promise<void> {
        try {
            const request: CreatePlanDefinitionOperationRequest = {
                createPlanDefinitionRequest: {
                    planDefinition: this.toExternal.mapPlanDefinition(planDefinition)
                }
            }
            await this.planDefinitionApi.createPlanDefinition(request)
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async updatePlanDefinition(planDefinition: PlanDefinition): Promise<void> {
        try {
            let thresholds: ThresholdDto[] = []
            planDefinition.questionnaires?.
                forEach(questionnaire => questionnaire.thresholds?.
                    forEach(threshold => {
                        //Only include if the type of collection is ThresholdNumbers === exclude thresholdOptions
                        if (threshold.thresholdNumbers!.length > 0) {
                            thresholds = thresholds.concat(this.toExternal.mapThreshold(threshold))
                        }
                    }))

            const request: PatchPlanDefinitionOperationRequest = {
                id: planDefinition.id!,
                patchPlanDefinitionRequest: {
                    questionnaireIds: planDefinition.questionnaires?.map(questionnaire => questionnaire.id),
                    status: planDefinition.status as unknown as PatchPlanDefinitionRequestStatusEnum,
                    name: planDefinition.name,
                    thresholds: thresholds
                }
            }
            await this.planDefinitionApi.patchPlanDefinition(request)
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async retirePlanDefinition(planDefinition: PlanDefinition): Promise<void> {
        try {
            const request = {
                id: planDefinition.id!
            }
            await this.planDefinitionApi.retirePlanDefinition(request)
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async createQuestionnaire(questionnaire: Questionnaire): Promise<void> {
        console.log("BFFBackendApi > createQuestionnaire", questionnaire)
        try {
            const request: CreateQuestionnaireOperationRequest = {
                createQuestionnaireRequest: {
                    questionnaire: this.toExternal.mapQuestionnaireToDto(questionnaire)
                }
            }

            console.log("request", request)
            await this.questionnaireApi.createQuestionnaire(request)
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async GetAllQuestionnaires(statusesToInclude: (QuestionnaireStatus | BaseModelStatus)[]): Promise<Questionnaire[]> {
        try {
            const request: GetQuestionnairesRequest = {
                statusesToInclude: statusesToInclude.map(status => status.toString())
            }
            const response = await this.questionnaireApi.getQuestionnaires(request);
            const toReturn = response.map(x => this.toInternal.mapQuestionnaire(x))
            return toReturn;
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async GetAllMeasurementTypes(): Promise<MeasurementType[]> {
        try {
            const result = await this.valueSetApi.getMeasurementTypes();

            return result.map(mt => this.toInternal.mapMeasurementType(mt))
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async GetPlanDefinitionById(planDefinitionId: string): Promise<PlanDefinition> {
        try {
            const allplanDefinitions = await this.GetAllPlanDefinitions([])
            const result = allplanDefinitions.find(x => x.id === planDefinitionId);
            if (!result)
                throw new NotFoundError()

            return result
        } catch (error) {
            return this.HandleError(error)
        }
    }


    async updateQuestionnaire(questionnaire: Questionnaire): Promise<void> {
        try {
            const questions = questionnaire.getParentQuestions().concat(questionnaire.getChildQuestions());
            const request: PatchQuestionnaireOperationRequest = {

                id: questionnaire.id,
                patchQuestionnaireRequest: {
                    title: questionnaire.name,
                    status: questionnaire.status?.toString(),
                    callToAction: this.toExternal.mapCallToAction(questionnaire.getCallToActions()[0]),
                    //questions: questions?.map(question => this.toExternal.mapQuestion(question, questionnaire.thresholds?.find(t => t.questionId === question.Id && question.type === QuestionTypeEnum.BOOLEAN))),
                    questions: questions?.map(question => this.toExternal.mapQuestion(question, questionnaire.thresholds?.find(t => t.questionId === question.Id ))),
                }
            }

            await this.questionnaireApi.patchQuestionnaire(request)
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async retireQuestionnaire(questionnaire: Questionnaire): Promise<void> {
        try {
            const request = {
                id: questionnaire.id!
            }
            await this.questionnaireApi.retireQuestionnaire(request)
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetQuestionnaire(questionnaireId: string): Promise<Questionnaire | undefined> {
        try {
            const request = {
                id: questionnaireId
            }
            const questionnaireDto = await this.questionnaireApi.getQuestionnaireById(request);
            return this.toInternal.mapQuestionnaire(questionnaireDto);
        } catch (error) {
            return this.HandleError(error);
        }
    }


    async ResetPassword(patient: PatientDetail): Promise<void> {
        try {
            const api = this.patientApi;
            const request = {
                cpr: patient.cpr!
            }
            await api.resetPassword(request)
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetPatients(includeActive: boolean, includeCompleted: boolean, page: number, pageSize: number): Promise<PatientDetail[]> {
        try {
            const api = this.patientApi
            const request = {
                includeActive: includeActive,
                includeCompleted: includeCompleted,
                pageNumber: page,
                pageSize: pageSize
            }

            const carePlans = await api.getPatients(request)
            if (!carePlans.patients)
                return []

            return carePlans.patients.map(patient => this.toInternal.mapPatientDto(patient));
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async RemoveAlarm(task: Task): Promise<void> {
        try {
            const api = this.careplanApi
            const request = {
                id: FhirUtils.unqualifyId(task.carePlanId),
                questionnaireId: FhirUtils.unqualifyId(task.questionnaireId)
            }

            return await api.resolveAlarm(request)
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async TerminateCareplan(careplan: PatientCareplan): Promise<void> {
        try {
            const request = {
                id: careplan.id!
            }
            return await this.careplanApi.completeCarePlan(request)
        } catch (error: unknown) {
            return await this.HandleError(error)
        }

    }

    async SearchPatient(searchstring: string): Promise<PatientDetail[]> {
        try {
            const request = {
                searchString: searchstring
            }

            const result = await this.patientApi.searchPatients(request)
            if (!result.patients)
                return [];

            return result.patients?.map(p => this.toInternal.mapPatientDto(p))

        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetAllPlanDefinitions(statusesToInclude: (PlanDefinitionStatus | BaseModelStatus)[]): Promise<PlanDefinition[]> {
        try {
            const api = this.planDefinitionApi;

            const request: GetPlanDefinitionsRequest = {
                statusesToInclude: statusesToInclude.map(status => status.toString())
            }
            const planDefinitions = await api.getPlanDefinitions(request);

            return planDefinitions.map(pd => this.toInternal.mapPlanDefinitionDto(pd))
        } catch (error: unknown) {
            return await this.HandleError(error)
        }

    }

    async AddQuestionnaireToCareplan(careplan: PatientCareplan, questionnaireToAdd: Questionnaire): Promise<PatientCareplan> {
        try {
            throw new NotImplementedError();
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async CreateCarePlan(carePlan: PatientCareplan): Promise<string> {
        try {
            const api = this.careplanApi
            const request = {
                createCarePlanRequest: {
                    carePlan: this.toExternal.mapCarePlan(carePlan)
                }
            }

            const response = await api.createCarePlanRaw(request)

            // Extract Location header, extract the id
            const location = response.raw.headers?.get('Location')
            if (!location) {
                throw new Error('No Location header in CreateCarePlan response!')
            }

            const parts = location.split('/')
            return parts[parts.length - 1]
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
        try {
            const api = this.careplanApi

            const primaryContact = careplan?.patient?.primaryContact as PrimaryContact

            const request = {
                id: careplan.id!,
                updateCareplanRequest: {
                    planDefinitionIds: careplan.planDefinitions.map(pd => pd.id) as string[],
                    questionnaires: careplan.questionnaires.map(q => {
                        return {
                            id: q.id,
                            frequency: this.toExternal.mapFrequency(q.frequency!)
                        }
                    }),
                    patientPrimaryPhone: careplan?.patient?.contact?.primaryPhone,
                    patientSecondaryPhone: careplan?.patient?.contact?.secondaryPhone,
                    primaryRelativeName: primaryContact?.fullname,
                    primaryRelativeAffiliation: primaryContact?.affiliation,
                    primaryRelativePrimaryPhone: primaryContact?.contact?.primaryPhone,
                    primaryRelativeSecondaryPhone: primaryContact?.contact?.secondaryPhone,
                }
            }

            await api.patchCarePlan(request)
            return careplan
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async UpdateQuestionnaireResponseStatus(id: string, status: QuestionnaireResponseStatus): Promise<QuestionnaireResponseStatus> {
        try {
            const api = this.questionnaireResponseApi;
            const request = { id: FhirUtils.unqualifyId(id), partialUpdateQuestionnaireResponseRequest: { examinationStatus: this.toExternal.mapQuestionnaireResponseStatus(status) } };
            await api.patchQuestionnaireResponse(request)
            return status;
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetUnfinishedQuestionnaireResponseTasks(page: number, pagesize: number): Promise<Array<Task>> {
        try {
            const api = this.questionnaireResponseApi;
            const request = {
                status: [GetQuestionnaireResponsesByStatusStatusEnum.NotExamined, GetQuestionnaireResponsesByStatusStatusEnum.UnderExamination],
                pageNumber: page,
                pageSize: pagesize
            };

            const questionnaireResponses = await api.getQuestionnaireResponsesByStatus(request);
            return questionnaireResponses.map(qr => this.toInternal.buildAnsweredTaskFromQuestionnaireResponse(qr))
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetUnansweredQuestionnaireTasks(page: number, pagesize: number): Promise<Array<Task>> {
        try {
            const api = this.careplanApi
            const request = {
                onlyUnsatisfiedSchedules: true,
                onlyActiveCareplans: true,
                //pageNumber: undefined,
                //pageSize: undefined
            }


            const carePlans = await api.searchCarePlans(request)
            const allUnanswered = carePlans.flatMap(cp => this.toInternal.buildUnansweredTaskFromCarePlan(cp))
            const start = ((page - 1) * pagesize);
            const toReturn = allUnanswered.slice(start, start + pagesize);
            //console.log(allUnanswered, "slice(", start, ",", start+pagesize, ") = ", toReturn)
            return toReturn;
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async IsPatientOnUnanswered(cpr: string): Promise<boolean> {
        try {
            const api = this.careplanApi
            const request = {
                cpr: cpr,
                onlyUnsatisfiedSchedules: true,
                onlyActiveCareplans: true,
                pageNumber: 1,
                pageSize: 1
            }
            const carePlans = await api.searchCarePlans(request)
            return carePlans.some(() => true);

        } catch (error: unknown) {
            return await this.HandleError(error)
        }

    }

    async GetPerson(cpr: string): Promise<Person> {
        try {
            const api = this.personApi
            const request = { cpr: cpr };
            const person = await api.getPerson(request).catch(err => { console.log(err); throw err; });;
            return this.toInternal.mapPersonFromExternalToInternal(person);
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }


    async GetActiveUser(): Promise<User> {
        try {
            const api = this.userApi;
            const request = {};
            const user = await api.getUser(request).catch(err => { console.log(err); throw err; });;
            return this.toInternal.mapUserFromExternalToInternal(user);
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetPatientCareplans(cpr: string): Promise<PatientCareplan[]> {
        try {
            // Retrieve the careplans
            const api = this.careplanApi;
            const request = {
                cpr: cpr,
                onlyActiveCareplans: true,
                pageNumber: 1,
                pageSize: 100
            };
            const carePlans = await api.searchCarePlans(request);
            if (!carePlans) {
                throw new Error('Could not retrieve careplans!');
            }

            return carePlans.map(cp => this.toInternal.mapCarePlanDto(cp));
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetPatientCareplanById(id: string): Promise<PatientCareplan> {
        try {
            // Retrieve the careplan
            const api = this.careplanApi;
            const carePlan = await api.getCarePlanById({ id: id })
            if (!carePlan) {
                throw new Error('Could not retrieve careplan!');
            }

            return this.toInternal.mapCarePlanDto(carePlan);
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetQuestionnaireResponses(careplanId: string, questionnaireIds: string[], offset: number, limit: number): Promise<PaginatedList<QuestionnaireResponse>> {
        try {
            const api = this.questionnaireResponseApi
            const request = {
                carePlanId: careplanId,
                questionnaireIds: questionnaireIds,
                pageNumber: offset,
                pageSize: limit
            }
            const response = await api.getQuestionnaireResponsesByCarePlanId(request)

            return {
                offset: response.offset ?? 0,
                limit: response.limit ?? 0,
                total: response.total ?? 0,
                list:  response.list ? response.list.map(qr => this.toInternal.mapQuestionnaireResponseDto(qr)) : []
            }
        } catch (error: unknown) {
            return await this.HandleError(error)
        }

    }

    async IsQuestionnaireInUse(questionnaireId: string): Promise<boolean> {
        try {
            const api = this.questionnaireApi
            const requesti: IsQuestionnaireInUseRequest = {
                id: questionnaireId
            }

            return await api.isQuestionnaireInUse(requesti)
        } catch (error: unknown) {
            return await this.HandleError(error)
        }

    }

    async IsPlanDefinitionInUse(planDefinitionId: string): Promise<boolean> {
        try {
            const api = this.planDefinitionApi
            const request: IsPlanDefinitionInUseRequest = {
                id: planDefinitionId
            }

            const result = await api.isPlanDefinitionInUse(request);
            if (typeof result === 'string') {
                return (result === 'true')
            }
            else {
                return result;
            }
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }

    async GetUnresolvedQuestionnaires(careplanId: string): Promise<string[]> {
        try {
            const api = this.careplanApi
            const request: GetUnresolvedQuestionnairesRequest = {
                id: careplanId
            }
            return await api.getUnresolvedQuestionnaires(request);
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }
    

    async GetAllPlanDefinitionsForCarplan(statusesToInclude: (BaseModelStatus | PlanDefinitionStatus)[]): Promise<PlanDefinition[]> {
        try {
            const api = this.careplanApi;

            const request: GetPlanDefinitionsRequest = {
                statusesToInclude: statusesToInclude.map(status => status.toString())
            }
            const planDefinitions = await api.getPlanDefinitions1(request);

            return planDefinitions.map(pd => this.toInternal.mapPlanDefinitionDto(pd))
        } catch (error: unknown) {
            return await this.HandleError(error)
        }
    }
    
}


