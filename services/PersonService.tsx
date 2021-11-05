

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Person } from "../components/Models/Person";
import IPersonService from "./interfaces/IPersonService";

export default class PersonService implements IPersonService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        this.backendApi = backendApi;
    }
    
    GetPerson(cpr : string) : Promise<Person>{
        return this.backendApi.GetPerson(cpr);
    }

}
  