

import React from "react";
import { IBackendApi } from "../apis/IBackendApi";
import { Answer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";
import { UserContext } from "../generated";
import { PersonDto } from "../generated/models/PersonDto";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import IPersonService from "./interfaces/IPersonService";
import IUserService from "./interfaces/IUserService";

export default class UserService extends BaseService implements IUserService {
    backendApi: IBackendApi

    constructor(backendApi: IBackendApi) {
        super()
        this.backendApi = backendApi;
    }
    async ResetPassword(patient: PatientDetail): Promise<void> {
        try {

            return await this.backendApi.ResetPassword(patient);
        } catch (error) {
            return this.HandleError(error);
        }
    }

    async GetActiveUser(): Promise<User> {
        try {
            return await this.backendApi.GetActiveUser();
        } catch (error) {
            return this.HandleError(error);
        }
    }

}
