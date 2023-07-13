

import { DayEnum } from "../../Models/Frequency";
import IDateHelper from "../interfaces/IDateHelper";
import DateProperties from "./DateProperties";

export default class DanishDateHelper implements IDateHelper {

    DateToString(date: Date, properties?: DateProperties): string {
        if (!properties)
            properties = new DateProperties();

        let toReturn = "";

        if (properties.showDate) {
            toReturn += this.toTwoDigits(date.getDate())
        }
        if (properties.showMonth) {
            toReturn += "-"
            toReturn += this.toTwoDigits(date.getMonth() + 1) // Zero-indexed month.. Beacause JS..
        }
        if (properties.showYear) {
            toReturn += "-"
            toReturn += date.getFullYear()
        }
        if (properties.showTime) {
            toReturn += " kl. "
            toReturn += this.toTwoDigits(date.getHours())
            toReturn += ":"
            toReturn += this.toTwoDigits(date.getMinutes())
        }
        return toReturn;
    }

    private toTwoDigits(makeToTwoDigits: any): string {
        const string: string = makeToTwoDigits.toString();
        let toReturn = string;

        if (toReturn.length < 2)
            toReturn = "0" + toReturn

        return toReturn
    }

    days = [
        DayEnum.Sunday,
        DayEnum.Monday,
        DayEnum.Tuesday,
        DayEnum.Wednesday,
        DayEnum.Thursday,
        DayEnum.Friday,
        DayEnum.Saturday
    ]

    DayIndexToDay(dayIndex: number): DayEnum {
        return this.days[dayIndex];
    }
}


