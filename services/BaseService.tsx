import { InvalidInputError, InvalidInputModel } from "./Errors/InvalidInputError";
import { BaseApiError } from "./../apis/Errors/BaseApiError"
import { BaseServiceError } from "./Errors/BaseServiceError";
import { BadRequestError } from "./Errors/BadRequestError";
import { NotCorrectRightsError } from "./Errors/NotCorrectRightsError";
import { NotFoundError } from "./Errors/NotFoundError";
import { UnknownServiceError } from "./Errors/UnknownServiceError";

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

    HandleError(error : any) : any {
        console.debug("Transforming error to ApplicationError")
        console.log(error)
        let errorIsApiError = error instanceof BaseApiError
        let errorIsServiceError = error instanceof BaseServiceError

        if(errorIsApiError)
            throw this.FromApiToServiceError(error) //Make this error to Service-error
            
        if(errorIsServiceError)
            throw error; //The error is ok and can be displayed nicely
    
        throw new UnknownServiceError(error)
    }

    private FromApiToServiceError(apiError : BaseApiError) : BaseServiceError {
        if(apiError && apiError.response && apiError.errorMessage){
            switch(apiError.response.status) {
                case 400:
                    return new BadRequestError(apiError.errorMessage)
                case 401 : 
                    return new NotCorrectRightsError();
                case 403 : 
                    return new NotCorrectRightsError();
                case 404 : 
                    return new NotFoundError();
            }
        }

        return apiError
       
    }
}
  