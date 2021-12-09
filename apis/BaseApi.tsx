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
            let bodyText = "Fejl i data fra bagvedliggende api" // Bliver overskrevet såfremt vi godt kan få teksten ud fra response
            try{
                bodyText = await response.text() //Body can only be read once, and if it is not json, we want to display the non-json body
                let bodyJson = JSON.parse(bodyText)
                let errorDto = ErrorDtoFromJSON(bodyJson)
    
                throw new BaseApiError(response, errorDto.errorText!, errorDto.errorCode!)
            } catch(error){
                //When json-parser tries to parse fx "" we end up here
                throw new BaseApiError(response, bodyText,response.status!)
            }

        }
        
        throw error;
        
    }


}
  