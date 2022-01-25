import React from "react";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";

/**
 * UserService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IUserService {
    /**
     * Reset password for the patient
     */
    ResetPassword : (patient: PatientDetail) => Promise<void>;

    /**
     * Returns the user logged in
     */
    GetActiveUser : () => Promise<User>
    
}
  