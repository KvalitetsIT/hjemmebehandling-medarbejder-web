

import IDateHelper from "../interfaces/IDateHelper";

export default class DanishDateHelper implements IDateHelper {
    
    DateToString (date: Date) : string{
        let toReturn = "";
        toReturn += date.getDate()
        toReturn += "/"
        toReturn += date.getMonth()+1 // Zero-indexed month.. Beacause JS..
        toReturn += "-"
        toReturn += date.getFullYear()
        //console.log(date.toLocaleDateString() + " => " + toReturn)
        return toReturn;
    }

    DayIndexToDay (dayIndex: number) : string{
        if(dayIndex === 0)
            return "Søndag"
        if(dayIndex === 1)
            return "Mandag"
        if(dayIndex === 2)
            return "Tirsdag"
        if(dayIndex === 3)
            return "Onsdag"
        if(dayIndex === 4)
            return "Torsdag"
        if(dayIndex === 5)
            return "Fredag"
        if(dayIndex === 6)
            return "Lørdag"

        return "ukendt"
    }



}
  