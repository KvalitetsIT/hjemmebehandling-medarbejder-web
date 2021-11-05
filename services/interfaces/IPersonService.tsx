import React from "react";
import { Person } from "../../components/Models/Person";



export default interface IPatientService {
    GetPerson : (cpr : string) => Promise<Person>
    
}
  