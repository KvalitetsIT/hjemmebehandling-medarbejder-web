import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";

/**
 * PersonService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export interface IPersonService {
    /**
     * Get person from CPR
     * - Is used fx when creating a patient
     */
    GetPerson : (cpr : string) => Promise<Person>
    
}
  