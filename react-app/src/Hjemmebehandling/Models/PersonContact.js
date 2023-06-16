"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const StringFormatters_1 = require("../Helpers/ModelHelpers/StringFormatters");
class PersonContact {
    primaryPhonenumberToString() {
        return StringFormatters_1.StringFormatter.FormatPhonenumber(this.primaryPhone);
    }
    secondaryPhonenumberToString() {
        return StringFormatters_1.StringFormatter.FormatPhonenumber(this.secondaryPhone);
    }
}
exports.default = PersonContact;
