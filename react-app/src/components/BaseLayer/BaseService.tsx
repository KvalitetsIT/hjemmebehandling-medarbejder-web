import { BaseApiError } from "../Errorhandling/BaseApiError";
import { BaseServiceError } from "../Errorhandling/BaseServiceError";
import { BadGatewayError } from "../Errorhandling/ServiceErrors/BadGatewayError";
import { BadRequestError } from "../Errorhandling/ServiceErrors/BadRequestError";
import { GenericApiError } from "../Errorhandling/ServiceErrors/GenericApiError";
import { InternalServerError } from "../Errorhandling/ServiceErrors/InternalServerError";
import { InvalidInputError, InvalidInputModel } from "../Errorhandling/ServiceErrors/InvalidInputError";
import { NotCorrectRightsError } from "../Errorhandling/ServiceErrors/NotCorrectRightsError";
import { NotFoundError } from "../Errorhandling/ServiceErrors/NotFoundError";
import { UnknownServiceError } from "../Errorhandling/ServiceErrors/UnknownServiceError";


export class StatusCodeMap {
    statusCode: number;
    getErrorMethod: (apiError: BaseApiError) => BaseServiceError
    constructor(statusCode: number, getErrorMethod: (apiError: BaseApiError) => BaseServiceError) {
        this.statusCode = statusCode;
        this.getErrorMethod = getErrorMethod;
    }
}

export default class BaseService {

    statusCodeToErrorMethod: StatusCodeMap[] = []

    constructor() {
        this.AddStatusCodeToErrorMap(new StatusCodeMap(400, this.ReturnError400));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(401, this.ReturnError401));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(403, this.ReturnError403));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(404, this.ReturnError404));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(500, this.ReturnError500));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(502, this.ReturnError502));
    }

    ValidatePagination(page: number, pageSize: number): void {
        let errors: InvalidInputModel[] = [];
        if (page <= 0)
            errors.push(new InvalidInputModel("page", "Sidenummer skal være større end 0"))

        if (pageSize <= 0)
            errors.push(new InvalidInputModel("pageSize", "Sidestørrelse skal være større end 0"))

        if (errors.length > 0)
            throw new InvalidInputError(errors);
    }

    HandleError(error: any): any {
        console.debug("Transforming error to ApplicationError. Error: ", error)
        let errorIsApiError = error instanceof BaseApiError
        let errorIsServiceError = error instanceof BaseServiceError
        if (errorIsApiError)
            throw this.FromApiToServiceError(error) //Make this error to Service-error

        if (errorIsServiceError)
            throw error; //The error is ok and can be displayed nicely

        throw new UnknownServiceError(error)
    }

    public AddStatusCodeToErrorMap(statusCodeMap: StatusCodeMap) {
        const existing = this.statusCodeToErrorMethod.findIndex(x => x.statusCode == statusCodeMap.statusCode);
        if (existing > -1)
            this.statusCodeToErrorMethod.splice(existing, 1);
        this.statusCodeToErrorMethod.push(statusCodeMap);
    }

    private FromApiToServiceError(apiError: BaseApiError): BaseServiceError {
        if (apiError && apiError.response) {
            const matchingStatusMethod = this.statusCodeToErrorMethod.find(x => x.statusCode == apiError.response?.status);
            if (matchingStatusMethod)
                return matchingStatusMethod.getErrorMethod(apiError);
        }

        return new GenericApiError(apiError)
    }

    ReturnError400(apiError: BaseApiError): BaseServiceError {
        return new BadRequestError(apiError.errorMessage ?? "")
    }
    ReturnError401(apiError: BaseApiError): BaseServiceError {
        return new NotCorrectRightsError();
    }
    ReturnError403(apiError: BaseApiError): BaseServiceError {
        return new NotCorrectRightsError();
    }
    ReturnError404(apiError: BaseApiError): BaseServiceError {
        return new NotFoundError();
    }
    ReturnError500(apiError: BaseApiError): BaseServiceError {
        return new InternalServerError();
    }
    ReturnError502(apiError: BaseApiError): BaseServiceError {
        return new BadGatewayError(apiError.displayMessage(),apiError.displayUrl());
    }
}
