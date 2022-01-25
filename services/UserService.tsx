

import { IBackendApi } from "../apis/interfaces/IBackendApi";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";
import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
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
