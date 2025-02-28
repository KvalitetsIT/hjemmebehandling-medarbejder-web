import { Address } from "./Address";
import { DayEnum } from "./Frequency";
import SimpleDepartment from "./SimpleOrganization";

 export default class DetailedOrganization extends SimpleDepartment{
    address? : Address
    phoneNumber? : string
    phoneHours? : PhoneHour[]
    html?: string
}

export class PhoneHour{
    days : DayEnum[] = []
    timePeriods : TimePeriod[] = []

    toString() : string {
        let toReturn = "";
        toReturn += this.days.join(", ")
        toReturn += ", "
        toReturn += this.timePeriods.map(x=>x.fromTime + "-"+x.toTime).join(" og ")
        return toReturn;
    }
}

export class TimePeriod{
    fromTime? : string
    toTime? : string
}
