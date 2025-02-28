import { Person } from "../../components/Models/Person";

/**
 * PersonService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from ../Models
 */
export interface IPersonService {
    /**
     * Get person from CPR
     * - Is used fx when creating a patient
     */
    GetPerson : (cpr : string) => Promise<Person>
    
}
  