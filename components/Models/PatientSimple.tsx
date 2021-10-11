//Very little info about the patient. Used when all we want to show is small data about patient.
    //Used in: 
    //- Tasklist

export class PatientSimple {
    name: string;
    cpr: string;

    constructor(name: string, cpr : string){
        this.name = name;
        this.cpr = cpr;
    }
}