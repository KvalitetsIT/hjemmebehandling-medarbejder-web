import { Address } from "./Address";

export class Contact {
    fullname! : string;
    address : Address = new Address;
    primaryPhone! : string
    secondaryPhone! : string
    emailAddress! : string
}
