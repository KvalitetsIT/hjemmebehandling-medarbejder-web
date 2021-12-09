import React from "react";
import { PatientCareplan } from "../../components/Models/PatientCareplan";



export default interface ICareplanService {
    CreateCarePlan : (carePlan : PatientCareplan) => Promise<string>
    GetPatientCareplanById : (id : string) => Promise<PatientCareplan>
    GetPatientCareplans : (cpr : string) => Promise<Array<PatientCareplan>>
    SetCareplan : (careplan : PatientCareplan) => Promise<PatientCareplan>
    TerminateCareplan : (careplan : PatientCareplan) => Promise<PatientCareplan>;
}
  