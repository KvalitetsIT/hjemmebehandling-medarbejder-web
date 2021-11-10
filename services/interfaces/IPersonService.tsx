import React from "react";
import { PersonDto } from "../../generated/models/PersonDto";

export default interface IPersonService {
    GetPerson : (cpr : string) => Promise<PersonDto>
    
}
  