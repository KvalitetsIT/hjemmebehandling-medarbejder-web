import React from "react";
import { PersonDto } from "../../generated/models/PersonDto";



export default interface IPatientService {
    GetPerson : (cpr : string) => Promise<PersonDto>
    
}
  