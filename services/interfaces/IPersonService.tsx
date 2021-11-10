import React from "react";
import { Person } from "../../components/Models/Person";

export default interface IPersonService {
    GetPerson : (cpr : string) => Promise<Person>
    
}
  