import React from "react";
import { PatientCareplan } from "../../components/Models/PatientCareplan";



export default interface ICareplanService {
    CreateCarePlan : (carePlan : PatientCareplan) => Promise<PatientCareplan>
    GetPatientCareplans : (cpr : string) => Promise<Array<PatientCareplan>>
    SetPlanDefinitionsOnCareplan : (careplan : PatientCareplan) => Promise<PatientCareplan>
    TerminateCareplan : (careplan : PatientCareplan) => Promise<PatientCareplan>;
}
  