import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber";

import { IBackendApi } from "./IBackendApi";

import { CarePlanApi } from "../generated/apis/CarePlanApi";
import { PersonApi } from "../generated/apis/PersonApi";
import { QuestionnaireResponseApi, GetQuestionnaireResponsesByStatusStatusEnum } from "../generated/apis/QuestionnaireResponseApi";

import { Configuration, CustomUserApi, ErrorDtoFromJSON, PatientApi, PlanDefinitionApi, UserApi } from "../generated";

import FhirUtils from "../util/FhirUtils";
import BaseApi from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseApi";

import { NotImplementedError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ApiErrors/NotImplementedError";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";
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
    patientApi = new PatientApi(this.conf);
    customUserApi = new CustomUserApi(this.conf);
    constructor() {
        super();
        this.toInternal = new ExternalToInternalMapper();
        this.toExternal = new InternalToExternalMapper();
    }
    
    async ResetPassword(patient: PatientDetail): Promise<void> {
        try {
            let api = this.customUserApi;
            let request = {
                cpr: patient.cpr!
            }
            await api.resetPassword(request)
        } catch(error: any) {
            return await this.HandleError(error)
        }
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
                id : careplan.id!
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
            let api = this.careplanApi
            let request = {
                id: careplan.id!,
                updateCareplanRequest: {
                    planDefinitionIds: careplan.planDefinitions.map(pd => pd.id),
                    questionnaires: careplan.questionnaires.map(q => {
                        return {
                            id: q.id,
                            frequency: this.toExternal.mapFrequency(q.frequency!)
                        }
                    }),
                    patientPrimaryPhone: careplan?.patient?.primaryPhone,
                    patientSecondaryPhone: careplan?.patient?.secondaryPhone,
                    primaryRelativeName: careplan?.patient?.contact.fullname,
                    primaryRelativeAffiliation: careplan?.patient?.contact.affiliation,
                    primaryRelativePrimaryPhone: careplan?.patient?.contact.primaryPhone,
                    primaryRelativeSecondaryPhone: careplan?.patient?.contact.secondaryPhone,
                }
            }

            var response = await api.patchCarePlan(request)
            return careplan
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


    async GetActiveUser(): Promise<User> {
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


