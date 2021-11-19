

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "../components/Models/Answer";
import { CategoryEnum } from "../components/Models/CategoryEnum";
import { Person } from "../components/Models/Person";
import { UserContext } from "../generated";
import { PersonDto } from "../generated/models/PersonDto";
import BaseService from "./BaseService";
import IPersonService from "./interfaces/IPersonService";
import IUserService from "./interfaces/IUserService";

export default class UserService extends BaseService implements IUserService {
    backendApi : IBackendApi
    
    constructor(backendApi : IBackendApi){
        super()
        this.backendApi = backendApi;
    }
    
    GetUser() : Promise<UserContext>{
        return this.backendApi.GetUser();
    }

}
  