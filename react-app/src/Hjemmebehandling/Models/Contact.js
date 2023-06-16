"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contact = void 0;
const StringFormatters_1 = require("../Helpers/ModelHelpers/StringFormatters");
class Contact {
    primaryPhonenumberToString() {
        return StringFormatters_1.StringFormatter.FormatPhonenumber(this.primaryPhone);
    }
    secondaryPhonenumberToString() {
        return StringFormatters_1.StringFormatter.FormatPhonenumber(this.secondaryPhone);
    }
}
exports.Contact = Contact;
