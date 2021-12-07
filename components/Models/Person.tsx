import PersonContact  from "./PersonContact";

export class Person {

    cpr!: string;
    givenName?: string;
    familyName?: string;
    gender?: string;
    birthDate?: string;
    deceasedBoolean?: boolean;

    patientContactDetails! : PersonContact; // Contactinfo for the patient

}