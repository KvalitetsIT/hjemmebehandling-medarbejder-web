import { StringFormatter } from "../Helpers/ModelHelpers/StringFormatters";
import { Address } from "./Address";

export class ContactDetails {
    email?: string
    primaryPhone? : string
    secondaryPhone? : string
    address?: Address

    primaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.primaryPhone);
    }
    secondaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.secondaryPhone);
    }
}
