

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Person } from "../components/Models/Person";
import { PersonDto } from "../generated/models/PersonDto";
import BaseService from "./BaseService";
import IPersonService from "./interfaces/IPersonService";

export default class PersonService extends BaseService implements IPersonService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }
    
    GetPerson(cpr : string) : Promise<PersonDto>{
        return this.backendApi.GetPerson(cpr);
    }

}
  