export class Frequency {
    repeated!: FrequencyEnum;
    days: DayEnum[] = [];
    deadline! : string;

    ToString() : string{
        let toReturn = "";
        this.days.sort(this.compareDayEnum)
        for(let i = 0;i<this.days.length; i++){
            if(i !== 0)
            toReturn += ", "    
            toReturn += this.days[i].slice(0,3) + ""
        }
        toReturn += this.repeated ? " ("+this.repeated+")" : ""
        toReturn += this.deadline ? " senest kl " :  ""
        toReturn += this.deadline ? this.deadline : ""
        return toReturn;
        
    }

    compareDayEnum(a : DayEnum, b : DayEnum){
        const weekdayOrder = [DayEnum.Monday,DayEnum.Tuesday,DayEnum.Wednesday,DayEnum.Thursday,DayEnum.Friday,DayEnum.Saturday,DayEnum.Sunday];
        return weekdayOrder.indexOf(a) - weekdayOrder.indexOf(b)
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