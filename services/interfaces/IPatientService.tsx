import React from "react";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PatientSimple } from "@kvalitetsit/hjemmebehandling/Models/PatientSimple";


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

    /**
     * Edits a patient using the provided patients' id
     */
    EditPatient : (patient: PatientDetail) => Promise<PatientDetail>

    /**
     * Create a patient from provided patient
     * the id will always be generated in the backend
     */
    CreatePatient : (patient : PatientDetail) => Promise<PatientDetail>
}
  