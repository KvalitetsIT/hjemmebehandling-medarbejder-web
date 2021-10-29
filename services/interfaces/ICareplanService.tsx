import React from "react";
import { PatientCareplan } from "../../components/Models/PatientCareplan";



export default interface ICareplanService {
    GetPatientCareplans : (cpr : string) => Promise<Array<PatientCareplan>>
    
}
  