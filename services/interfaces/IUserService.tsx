import React from "react";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { User } from "../../components/Models/User";

export default interface IUserService {
    ResetPassword : (patient: PatientDetail) => Promise<void>;
    GetActiveUser : () => Promise<User>
    CreateUser : (patient : PatientDetail) => Promise<User>
    
}
  