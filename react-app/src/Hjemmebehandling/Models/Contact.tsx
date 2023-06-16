import { StringFormatter } from "../Helpers/ModelHelpers/StringFormatters";

export class Contact {
    fullname? : string;
    primaryPhone? : string
    secondaryPhone? : string
    affiliation? : string; // f.eks. "kone", "ven", "far" etc

    primaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.primaryPhone);
    }
    secondaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.secondaryPhone);
    }
}
