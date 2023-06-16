"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodeMap = void 0;
const BaseApiError_1 = require("../Errorhandling/BaseApiError");
const BaseServiceError_1 = require("../Errorhandling/BaseServiceError");
const BadGatewayError_1 = require("../Errorhandling/ServiceErrors/BadGatewayError");
const BadRequestError_1 = require("../Errorhandling/ServiceErrors/BadRequestError");
const GenericApiError_1 = require("../Errorhandling/ServiceErrors/GenericApiError");
const InternalServerError_1 = require("../Errorhandling/ServiceErrors/InternalServerError");
const InvalidInputError_1 = require("../Errorhandling/ServiceErrors/InvalidInputError");
const NotCorrectRightsError_1 = require("../Errorhandling/ServiceErrors/NotCorrectRightsError");
const NotFoundError_1 = require("../Errorhandling/ServiceErrors/NotFoundError");
const UnknownServiceError_1 = require("../Errorhandling/ServiceErrors/UnknownServiceError");
class StatusCodeMap {
    constructor(statusCode, getErrorMethod) {
        this.statusCode = statusCode;
        this.getErrorMethod = getErrorMethod;
    }
}
exports.StatusCodeMap = StatusCodeMap;
class BaseService {
    constructor() {
        this.statusCodeToErrorMethod = [];
        this.AddStatusCodeToErrorMap(new StatusCodeMap(400, this.ReturnError400));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(401, this.ReturnError401));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(403, this.ReturnError403));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(404, this.ReturnError404));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(500, this.ReturnError500));
        this.AddStatusCodeToErrorMap(new StatusCodeMap(502, this.ReturnError502));
    }
    ValidatePagination(page, pageSize) {
        let errors = [];
        if (page <= 0)
            errors.push(new InvalidInputError_1.InvalidInputModel("page", "Sidenummer skal være større end 0"));
        if (pageSize <= 0)
            errors.push(new InvalidInputError_1.InvalidInputModel("pageSize", "Sidestørrelse skal være større end 0"));
        if (errors.length > 0)
            throw new InvalidInputError_1.InvalidInputError(errors);
    }
    HandleError(error) {
        console.debug("Transforming error to ApplicationError");
        console.log(error);
        let errorIsApiError = error instanceof BaseApiError_1.BaseApiError;
        let errorIsServiceError = error instanceof BaseServiceError_1.BaseServiceError;
        if (errorIsApiError)
            throw this.FromApiToServiceError(error); //Make this error to Service-error
        if (errorIsServiceError)
            throw error; //The error is ok and can be displayed nicely
        throw new UnknownServiceError_1.UnknownServiceError(error);
    }
    AddStatusCodeToErrorMap(statusCodeMap) {
        const existing = this.statusCodeToErrorMethod.findIndex(x => x.statusCode == statusCodeMap.statusCode);
        if (existing > -1)
            this.statusCodeToErrorMethod.splice(existing, 1);
        this.statusCodeToErrorMethod.push(statusCodeMap);
    }
    FromApiToServiceError(apiError) {
        if (apiError && apiError.response) {
            const matchingStatusMethod = this.statusCodeToErrorMethod.find(x => { var _a; return x.statusCode == ((_a = apiError.response) === null || _a === void 0 ? void 0 : _a.status); });
            if (matchingStatusMethod)
                return matchingStatusMethod.getErrorMethod(apiError);
        }
        return new GenericApiError_1.GenericApiError(apiError);
    }
    ReturnError400(apiError) {
        var _a;
        return new BadRequestError_1.BadRequestError((_a = apiError.errorMessage) !== null && _a !== void 0 ? _a : "");
    }
    ReturnError401(apiError) {
        return new NotCorrectRightsError_1.NotCorrectRightsError();
    }
    ReturnError403(apiError) {
        return new NotCorrectRightsError_1.NotCorrectRightsError();
    }
    ReturnError404(apiError) {
        return new NotFoundError_1.NotFoundError();
    }
    ReturnError500(apiError) {
        return new InternalServerError_1.InternalServerError();
    }
    ReturnError502(apiError) {
        return new BadGatewayError_1.BadGatewayError(apiError.displayMessage(), apiError.displayUrl());
    }
}
exports.default = BaseService;
