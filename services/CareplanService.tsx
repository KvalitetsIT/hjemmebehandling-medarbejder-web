

import { IBackendApi } from "../apis/interfaces/IBackendApi";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";

import BaseService from "@kvalitetsit/hjemmebehandling/BaseLayer/BaseService";
import {ICareplanService} from "./interfaces/ICareplanService";

export default class CareplanService extends BaseService implements ICareplanService {
  backendApi: IBackendApi

  constructor(backendApi: IBackendApi) {
    super()
    this.backendApi = backendApi;
  }
  async SetCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
    try {
      return await this.backendApi.SetCareplan(careplan)
    } catch (error) {
      return this.HandleError(error)
    }
  }

  async CreateCarePlan(carePlan: PatientCareplan): Promise<string> {
    try {
      return await this.backendApi.CreateCarePlan(carePlan)
    } catch (error : unknown) {
      return this.HandleError(error);
    }
  }

  async TerminateCareplan(careplan: PatientCareplan): Promise<PatientCareplan> {
    try {
      return await this.backendApi.TerminateCareplan(careplan);
    } catch (error : unknown) {
      return this.HandleError(error);
    }
  }

  async GetPatientCareplanById(id: string): Promise<PatientCareplan> {
    try {
      return await this.backendApi.GetPatientCareplanById(id);
    } catch (error : unknown) {
      return this.HandleError(error);
    }
  }

  async GetPatientCareplans(cpr: string): Promise<Array<PatientCareplan>> {
    try {
      return await this.backendApi.GetPatientCareplans(cpr);
    } catch (error : unknown) {
      return this.HandleError(error);
    }
  }

  async GetUnresolvedQuestionnaires(careplanId: string): Promise<string[]> {
    try {
      return await this.backendApi.GetUnresolvedQuestionnaires(careplanId);
    } catch (error: unknown) {
        return await this.HandleError(error)
    }
}




}
