import { Contact } from "./Contact";

export class Person {

    cpr!: string;
    givenName?: string;
    familyName?: string;
    gender?: string;
    birthDate?: string;
    deceasedBoolean?: boolean;

    patientContactDetails! : Contact; // Contactinfo for the patient

}