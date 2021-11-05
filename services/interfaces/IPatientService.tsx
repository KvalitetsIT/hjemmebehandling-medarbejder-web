import React from "react";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { PatientSimple } from "../../components/Models/PatientSimple";



export default interface IPatientService {
    SearchPatient : (searchString : string) => Promise<PatientDetail[]>
    GetPatient : (cpr : string) => Promise<PatientDetail>

    EditPatient : (patient: PatientDetail) => Promise<PatientDetail>
    CreatePatient : (patient : PatientDetail) => Promise<PatientDetail>
}
  