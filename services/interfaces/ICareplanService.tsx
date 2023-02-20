import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";


/**
 * CareplanService
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export interface ICareplanService {

    /**
     * Returns ids of unresolved questionnaires
     * The questionnaires with unanswered questions
     * @param careplanId 
     */
    GetUnresolvedQuestionnaires(careplanId: string): Promise<string[]>;

    /**
     * Creates a careplan using the careplan provided
     * The ID wil always be auto-generated
     * @param careplan 
     * @returns id of the new careplan
     */
    CreateCarePlan: (carePlan: PatientCareplan) => Promise<string>

    /**
     * Retrieves a careplan from the given id
     * @param id the careplanId
     * @returns a patientcareplan with the matching id
     */
    GetPatientCareplanById: (id: string) => Promise<PatientCareplan>

    /**
     * Get all careplans attached to a specified CPR
     * @param cpr find careplans based on this cpr
     * @returns a list of careplans which matches the given cpr
     */
    GetPatientCareplans: (cpr: string) => Promise<Array<PatientCareplan>>

    /**
     * Edit a specifick careplan
     * Uses the id in the provided careplan to find the careplan in backend to edit
     * @param careplan the careplan with the new values
     * @returns the patientcareplan after editation
     */
    SetCareplan: (careplan: PatientCareplan) => Promise<PatientCareplan>

    /**
     * Finishes a careplan using the id in the provided careplan
     * @param careplan the careplan to complete
     * @returns the careplan that has been terminated
     */
    TerminateCareplan: (careplan: PatientCareplan) => Promise<PatientCareplan>;
}
