import {BaseApiError} from "./../apis/Errors/BaseApiError"

export default class BaseApi {
    
    /**
     * Transform responses into BaseApiErrors
     * @param error the thrown error from api-method (this should be of type response)
     */
    HandleError(error : any) : any{
        console.debug("Transforming error to ServiceError")
        console.log(error)
        if(error instanceof Response){
            let response = error as Response;
            throw new BaseApiError(response);
        }
        
        throw error;
        
    }


}
  