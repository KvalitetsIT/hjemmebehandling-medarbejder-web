import { StringFormatter } from "../Helpers/ModelHelpers/StringFormatters";

export default class PersonContact {
    city? : string;
    street? : string;
    postalCode? : string;
    country? : string;
    primaryPhone? : string;
    secondaryPhone? : string;
    emailAddress? : string;
    
    primaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.primaryPhone);
    }
    secondaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.secondaryPhone);
    }

}
