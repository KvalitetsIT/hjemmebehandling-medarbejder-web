

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Person } from "../components/Models/Person";
import BaseService from "./BaseService";
import IPersonService from "./interfaces/IPersonService";

export default class PersonService extends BaseService implements IPersonService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }
    
    async GetPerson(cpr : string) : Promise<Person>{
        try{
        return await this.backendApi.GetPerson(cpr);
    } catch(error : any){
        return this.HandleError(error);
      }
    }

}
  