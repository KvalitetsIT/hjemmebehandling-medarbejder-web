import React from "react";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { PatientSimple } from "../../components/Models/PatientSimple";



export default interface IPatientService {
    CreatePatient : (patient : PatientDetail) => Promise<PatientDetail>
    SearchPatient : (searchString : string) => Promise<PatientSimple[]>
}
  