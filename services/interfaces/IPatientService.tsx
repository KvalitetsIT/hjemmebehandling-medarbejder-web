import React from "react";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PatientSimple } from "@kvalitetsit/hjemmebehandling/Models/PatientSimple";



export default interface IPatientService {
    SearchPatient : (searchString : string) => Promise<PatientDetail[]>
    GetPatients : (includeActive : boolean, page : number, pageSize : number) => Promise<PatientDetail[]>

    EditPatient : (patient: PatientDetail) => Promise<PatientDetail>
    CreatePatient : (patient : PatientDetail) => Promise<PatientDetail>
}
  