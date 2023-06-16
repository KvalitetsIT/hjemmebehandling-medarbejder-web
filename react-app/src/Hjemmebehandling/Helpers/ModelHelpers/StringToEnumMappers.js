"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringToEnumMappers = void 0;
const BaseModelStatus_1 = require("../../Models/BaseModelStatus");
class StringToEnumMappers {
    static stringToBaseModelStatus(stringStatus) {
        switch (stringStatus) {
            case "DRAFT":
                return BaseModelStatus_1.BaseModelStatus.DRAFT;
            case "ACTIVE":
                return BaseModelStatus_1.BaseModelStatus.ACTIVE;
            case "RETIRED":
                return BaseModelStatus_1.BaseModelStatus.RETIRED;
            case "COMPLETED":
                return BaseModelStatus_1.BaseModelStatus.COMPLETED;
            default:
                return BaseModelStatus_1.BaseModelStatus.UKENDT;
        }
    }
}
exports.StringToEnumMappers = StringToEnumMappers;
