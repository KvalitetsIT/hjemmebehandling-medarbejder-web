import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";


/**
 * PatientService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IPatientService {
    /**
     * Search for patients either by CPR og name
     * Returns list of results
     */
    SearchPatient : (searchString : string) => Promise<PatientDetail[]>

    /**
     * To retrieve all patients
     * - Active patients are considered as active when they have one active careplan
     * - Inactive patients are considered inactive when they dont have an active careplan
     */
    GetPatients : (includeActive : boolean,includeCompleted : boolean, page : number, pageSize : number) => Promise<PatientDetail[]>
}
  