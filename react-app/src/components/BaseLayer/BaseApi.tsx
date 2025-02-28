
import { BaseApiError } from "../Errorhandling/BaseApiError";
import { IRawApiError } from "../Errorhandling/IRawApiError";

export default class BaseApi {

    /**
     * Transform responses into BaseApiErrors
     * @param error the thrown error from api-method (this should be of type response)
     */
    async HandleError(error: any): Promise<any> {
        
        console.debug("Transforming error to ServiceError. Error:", error)
    
        if ((error as any).response  instanceof Response || error instanceof Response) {
            
            let response : Response  = ((error as any).response  instanceof Response ) ? (error as any).response as Response : error as Response
            
            let bodyText = "Fejl i data fra bagvedliggende api" // Bliver overskrevet såfremt vi godt kan få teksten ud fra response
            let errorDto : IRawApiError = {}

            try {
                bodyText = await response.text() //Body can only be read once, and if it is not json, we want to display the non-json body

                errorDto = JSON.parse(bodyText);
            } catch (error) { 
                //When json-parser tries to parse fx "" we end up here
                throw new BaseApiError(response, bodyText, response.status!)
            }

            throw new BaseApiError(response, errorDto.errorText, errorDto.errorCode)
        }
        throw error;
    }
}


