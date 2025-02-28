import { IBackendApi } from "../apis/interfaces/IBackendApi";
import BaseService from "../components/BaseLayer/BaseService";
import { BaseModelStatus } from "../components/Models/BaseModelStatus";
import { PlanDefinition, PlanDefinitionStatus } from "../components/Models/PlanDefinition";
import { IPlanDefinitionService } from "./interfaces/IPlanDefinitionService";

export default class PlanDefinitionService extends BaseService implements IPlanDefinitionService {
    backendApi: IBackendApi;

    constructor(backendapi: IBackendApi) {
        super();
        this.backendApi = backendapi;
    }

    async createPlanDefinition(planDefinition: PlanDefinition): Promise<void> {

        for (const questionnaire of planDefinition.questionnaires!) {
            
            questionnaire.thresholds = questionnaire.thresholds?.filter(x => x.thresholdNumbers ? x.thresholdNumbers.length > 0 : false)


        }
        
        try {
            return this.backendApi.createPlanDefinition(planDefinition)
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async updatePlanDefinition(planDefinition: PlanDefinition): Promise<void> {        
        try {
            return await this.backendApi.updatePlanDefinition(planDefinition)
        } catch (error) {
            return this.HandleError(error)
        }
    }

    async retirePlanDefinition(planDefinition: PlanDefinition): Promise<void> {        
        try {
            return await this.backendApi.retirePlanDefinition(planDefinition)
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

    async IsPlanDefinitionInUse(planDefinitionId: string): Promise<boolean> {
        try{
            return await this.backendApi.IsPlanDefinitionInUse(planDefinitionId);
        }catch(error){
            return this.HandleError(error)
        }
    }
}
