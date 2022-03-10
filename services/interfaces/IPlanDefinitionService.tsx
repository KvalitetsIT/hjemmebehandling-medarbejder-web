import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";

/**
 * QuestionnaireService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
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
     * Get all plan definitions
     * @returns all plandefinitions
    */
    GetAllPlanDefinitions(): Promise<Array<PlanDefinition>>



    /**
    * Returns one single plandefinitions in system
    * @param planDefinitionId the id of the plandefinition to fetch
    * @returns one single plandefinition
    * @throws if plandefinition with id does not exist 
    */
    GetPlanDefinitionById(planDefinitionId: string): Promise<PlanDefinition>

}
