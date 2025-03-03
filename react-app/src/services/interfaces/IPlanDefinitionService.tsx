import { BaseModelStatus } from "../../components/Models/BaseModelStatus";
import { PlanDefinition, PlanDefinitionStatus } from "../../components/Models/PlanDefinition";


/**
 * QuestionnaireService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from ../Models
 */
export interface IPlanDefinitionService {

    /**
     * Creates a plandefinition from provided plandefinition
     * @param planDefinition the plandefinition to be created
     */
    createPlanDefinition(planDefinition: PlanDefinition): Promise<void>;

    /**
     * Updates a plandefinition
     * Uses the id of the provided plandefinition to target what plandefinition to be changed
     * @param planDefinition the desired plandefinition
     */
    updatePlanDefinition(planDefinition: PlanDefinition): Promise<void>;

    /**
     * Updates a plandefinition
     * Uses the id of the provided plandefinition to target what plandefinition to be changed
     * @param planDefinition the desired plandefinition
     */
     retirePlanDefinition(planDefinition: PlanDefinition): Promise<void>;

    /**
     * Fetches all plandefinitions based on filters
     * @param statusesToInclude If empty, all statuses are included in response
     * @returns all plandefinitions in system complying to the filters
     */
    GetAllPlanDefinitions(statusesToInclude: (PlanDefinitionStatus | BaseModelStatus)[]): Promise<PlanDefinition[]>



    /**
    * Returns one single plandefinitions in system
    * @param planDefinitionId the id of the plandefinition to fetch
    * @returns one single plandefinition
    * @throws if plandefinition with id does not exist 
    */
    GetPlanDefinitionById(planDefinitionId: string): Promise<PlanDefinition>

    /**
     * Checks if the given plandefinition is in use by any careplans
     * @param planDefinitionId the id of the plandefinition to fetch
     * @returns true if the plandefinition is in use by any active careplans otherwise false  
     */
    IsPlanDefinitionInUse(planDefinitionId: string): Promise<boolean>;
}

