import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";


/**
 * CareplanService
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface ICareplanService {

    /**
     * Creates a careplan using the careplan provided
     * The ID wil always be auto-generated
     * @param careplan 
     */
    CreateCarePlan : (carePlan : PatientCareplan) => Promise<string>


    GetPatientCareplanById : (id : string) => Promise<PatientCareplan>

    /**
     * Get all careplans attached to a specified CPR
     */
    GetPatientCareplans : (cpr : string) => Promise<Array<PatientCareplan>>

    /**
     * Edit a specifick careplan
     * Uses the id in the provided careplan to find the careplan in backend to edit
     */
    SetCareplan : (careplan : PatientCareplan) => Promise<PatientCareplan>

    /**
     * Finishes a careplan using the id in the provided careplan
     */
    TerminateCareplan : (careplan : PatientCareplan) => Promise<PatientCareplan>;
}
  