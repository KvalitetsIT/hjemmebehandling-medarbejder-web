import React from "react";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";



export default interface IPatientService {
    CreatePatient : (patient : PatientDetail) => Promise<PatientDetail>
    
}
  