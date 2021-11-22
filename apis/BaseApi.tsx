import {BaseApiError} from "./../apis/Errors/BaseApiError"

export default class BaseApi {
    
    /**
     * Transform responses into BaseApiErrors
     * @param error the thrown error from api-method (this should be of type response)
     */
    HandleError(error : any) : any{
        let response = error as Response;
        console.log(response)
        throw new BaseApiError(response);
    }


}
  