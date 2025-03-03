import { PatientDetail } from "../../components/Models/PatientDetail";
import { User } from "../../components/Models/User";


/**
 * UserService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from ../Models
 */
export interface IUserService {
    /**
     * Reset password for the patient
     */
    ResetPassword: (patient: PatientDetail) => Promise<void>;

    /**
     * @returns user that is logged in
     */
    GetActiveUser: () => Promise<User>
}