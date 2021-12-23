import React from "react";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";

export default interface IUserService {
    ResetPassword : (patient: PatientDetail) => Promise<void>;
    GetActiveUser : () => Promise<User>
    
}
  