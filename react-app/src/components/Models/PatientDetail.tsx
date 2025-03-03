import { StringFormatter } from "../Helpers/ModelHelpers/StringFormatters";
import { Address } from "./Address";
import { ContactDetails } from "./Contact";
import { PatientSimple } from "./PatientSimple";
import { PrimaryContact } from "./PrimaryContact";

//When we want to display all info about a patient
//Used in 
//-patient-details
export class PatientDetail extends PatientSimple {
    contact? : ContactDetails;
    primaryContact?: PrimaryContact | PrimaryContact[];
    username? : string;

}