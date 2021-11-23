import { InvalidInputError, InvalidInputModel } from "./Errors/InvalidInputError";
import {BaseApiError} from "./../apis/Errors/BaseApiError"
import {BaseServiceError} from "./Errors/BaseServiceError"
import { UnknownServiceError } from "./Errors/UnknownServiceError";
import { NotCorrectRightsError } from "./Errors/NotCorrectRightsError";

export default class BaseService {
    ValidatePagination(page : number, pageSize : number) : void {
        let errors : InvalidInputModel[] = [];
        if(page <= 0)
            errors.push(new InvalidInputModel("page","Sidenummer skal være større end 0"))

        if(pageSize <= 0)
            errors.push(new InvalidInputModel("pageSize","Sidestørrelse skal være større end 0"))
        
        if(errors.length > 0)
            throw new InvalidInputError(errors);
    }

    HandleError(error : any) : any{
        let errorIsApiError = error instanceof BaseApiError
        let errorIsServiceError = error instanceof BaseServiceError

        if(errorIsApiError)
            throw this.FromApiToServiceError(error) //Make this error to Service-error
            
        if(errorIsServiceError)
            throw error; //The error is ok and can be displayed nicely
        
        throw new UnknownServiceError(error)
    }

    FromApiToServiceError(apiError : BaseApiError){
        if(apiError.response.status === 403)
            return new NotCorrectRightsError();
            
        if(apiError.response.status === 401)
            return new NotCorrectRightsError();

        return apiError;
    }
}
  