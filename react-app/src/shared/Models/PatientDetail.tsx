import { StringFormatter } from "../Helpers/ModelHelpers/StringFormatters";
import { Address } from "./Address";
import { Contact } from "./Contact";
import { PatientSimple } from "./PatientSimple";

//When we want to display all info about a patient
//Used in 
//-patient-details
export class PatientDetail extends PatientSimple {
    primaryPhone? : string
    secondaryPhone? : string
    address? : Address
    contact? : Contact;
    username? : string;

    primaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.primaryPhone);
    }
    secondaryPhonenumberToString() : string {
        return StringFormatter.FormatPhonenumber(this.secondaryPhone);
    }
}