

import { IBackendApi } from "../apis/interfaces/IBackendApi";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
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
    } catch(error : unknown){
        return this.HandleError(error);
      }
    }

}
  