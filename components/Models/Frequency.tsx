export class Frequency {
    repeated: FrequencyEnum = FrequencyEnum.Never;
    days: DayEnum[] = [];
    

    ToString(){
        let toReturn = "";
        for(let i = 0;i<this.days.length; i++){
            if(i != 0)
            toReturn += ", "    
            toReturn += this.days[i].slice(0,3) + ""
        }
        toReturn += " ("+this.repeated+")"
        return toReturn;
        
    }
}

export enum  FrequencyEnum {
    Never = "Gentages ikke",
    WEEKLY = "Ugentligt",
    EVERYOTHERWEEK = "Hver anden uge",
    MONTHLY = "Månedligt",
    YEARLY = "Årligt"
}

export enum DayEnum {
    Monday = "Mandag",
    Tuesday = "Tirsdag",
    Wednesday = "Onsdag",
    Thursday = "Torsdag",
    Friday = "Fredag",
    Saturday = "Lørdag",
    Sunday = "Søndag"
}