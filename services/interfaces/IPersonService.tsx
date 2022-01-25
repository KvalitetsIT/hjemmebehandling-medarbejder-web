import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import React from "react";

/**
 * PersonService 
 * - should be in charge of validating responses
 * - should contain logic between the api and frontend
 * - should only use domain-models from @kvalitetsit/hjemmebehandling/Models
 */
export default interface IPersonService {
    /**
     * Get person from CPR
     * - Is used fx when creating a patient
     */
    GetPerson : (cpr : string) => Promise<Person>
    
}
  