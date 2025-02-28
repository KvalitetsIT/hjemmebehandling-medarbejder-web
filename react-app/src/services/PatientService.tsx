

import { IBackendApi } from "../apis/interfaces/IBackendApi";
import BaseService from "../components/BaseLayer/BaseService";
import { PatientDetail } from "../components/Models/PatientDetail";

import {IPatientService} from "./interfaces/IPatientService";

export default class PatientService extends BaseService implements IPatientService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }

    async SearchPatient(searchString: string) : Promise<PatientDetail[]>{
        try{
        return await this.backendApi.SearchPatient(searchString);
    } catch(error : unknown){
        return this.HandleError(error);
      }
    }

    async GetPatients(includeActive : boolean,includeCompleted : boolean, page : number, pageSize : number) : Promise<PatientDetail[]>{
      try{
        this.ValidatePagination(page,pageSize);
        return await this.backendApi.GetPatients(includeActive,includeCompleted,page,pageSize)
    } catch(error : unknown){
        return this.HandleError(error);
      }
    }
    
    
}
  