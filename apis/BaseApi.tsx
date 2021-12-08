import {BaseApiError} from "./../apis/Errors/BaseApiError"
import { ErrorDtoFromJSON } from "../generated";

export default class BaseApi {
    
    /**
     * Transform responses into BaseApiErrors
     * @param error the thrown error from api-method (this should be of type response)
     */
    async HandleError(error : any) : Promise<any> {
        console.debug("Transforming error to ServiceError")
        console.log(error)
        if(error instanceof Response){
            let response = error as Response

            let body = await response.json()
            let errorDto = ErrorDtoFromJSON(body)

            throw new BaseApiError(response, errorDto.errorText!, errorDto.errorCode!)
        }
        
        throw error;
        
    }


}
  