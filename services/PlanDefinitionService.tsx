import { IBackendApi } from "../apis/interfaces/IBackendApi";
import { PlanDefinition, PlanDefinitionStatus } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import { IPlanDefinitionService } from "./interfaces/IPlanDefinitionService";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import InternalToExternalMapper from "../apis/Mappers/InternalToExternalMapper";

export default class PlanDefinitionService extends BaseService implements IPlanDefinitionService {
    backendApi: IBackendApi;

    constructor(backendapi: IBackendApi) {
        super();
        this.backendApi = backendapi;
    }

    async createPlanDefinition(planDefinition: PlanDefinition): Promise<void> {
        try {
            return this.backendApi.createPlanDefinition(planDefinition)
        } catch (error) {
            return this.HandleError(error)
        }
    }
    async updatePlanDefinition(planDefinition: PlanDefinition): Promise<void> {
        const toExternal = new InternalToExternalMapper();
        console.log("thresholds: ",planDefinition.questionnaires?.flatMap(x => x.thresholds).flatMap(threshold => toExternal.mapThreshold(threshold)))
        
        try {
            return this.backendApi.updatePlanDefinition(planDefinition)
        } catch (error) {
            return this.HandleError(error)
        }
    }


    async GetAllPlanDefinitions(statusesToInclude: (PlanDefinitionStatus | BaseModelStatus)[] ): Promise<PlanDefinition[]> {
        try {
            return await this.backendApi.GetAllPlanDefinitions(statusesToInclude);
        } catch (error: unknown) {
            return this.HandleError(error);
        }
    }

    async GetPlanDefinitionById(planDefinitionId: string): Promise<PlanDefinition> {
        try {
            return await this.backendApi.GetPlanDefinitionById(planDefinitionId);
        } catch (error: unknown) {
            return this.HandleError(error);
        }
    }

}
