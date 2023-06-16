"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseApiError_1 = require("../Errorhandling/BaseApiError");
class BaseApi {
    /**
     * Transform responses into BaseApiErrors
     * @param error the thrown error from api-method (this should be of type response)
     */
    HandleError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            console.debug("Transforming error to ServiceError");
            console.log(error);
            if (error instanceof Response) {
                let response = error;
                let bodyText = "Fejl i data fra bagvedliggende api"; // Bliver overskrevet såfremt vi godt kan få teksten ud fra response
                let errorDto = {};
                try {
                    bodyText = yield response.text(); //Body can only be read once, and if it is not json, we want to display the non-json body
                    errorDto = JSON.parse(bodyText);
                }
                catch (error) {
                    //When json-parser tries to parse fx "" we end up here
                    throw new BaseApiError_1.BaseApiError(response, bodyText, response.status);
                }
                throw new BaseApiError_1.BaseApiError(response, errorDto.errorText, errorDto.errorCode);
            }
            throw error;
        });
    }
}
exports.default = BaseApi;
