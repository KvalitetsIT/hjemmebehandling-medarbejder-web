

import { IBackendApi } from "../apis/interfaces/IBackendApi";
import BaseService from "../components/BaseLayer/BaseService";
import { Person } from "../components/Models/Person";

import {IPersonService} from "./interfaces/IPersonService";

export default class PersonService extends BaseService implements IPersonService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }
    
    async GetPerson(cpr : string) : Promise<Person>{
        try{
        return await this.backendApi.GetPerson(cpr);
    } catch(error : unknown){
        return this.HandleError(error);
      }
    }

}
  
