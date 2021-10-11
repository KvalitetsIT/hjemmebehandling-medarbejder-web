import { Contact } from "./Contact";
import { PatientSimple } from "./PatientSimple";

//When we want to display all info about a patient
//Used in 
//-patient-details
export class PatientDetail extends PatientSimple {
    patientContact! : Contact; // Contactinfo for the patient
    contacts : Contact[] = []
}