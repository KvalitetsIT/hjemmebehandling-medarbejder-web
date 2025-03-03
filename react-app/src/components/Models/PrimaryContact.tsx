import { ContactDetails } from "./Contact";

export class PrimaryContact {
    fullname? : string;
    affiliation? : string; // f.eks. "kone", "ven", "far" etc
    organisation?: string;
    contact?: ContactDetails
}