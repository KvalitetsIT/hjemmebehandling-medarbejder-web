

import { IBackendApi } from "../apis/interfaces/IBackendApi";
import BaseService from "../components/BaseLayer/BaseService";
import { PatientDetail } from "../components/Models/PatientDetail";
import { User } from "../components/Models/User";
import {IUserService} from "./interfaces/IUserService";

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
