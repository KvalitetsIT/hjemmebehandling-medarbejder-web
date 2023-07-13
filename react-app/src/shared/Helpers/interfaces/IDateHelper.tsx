import { DayEnum } from "../../Models/Frequency";
import DateProperties from "../danishImpl/DateProperties";

export default interface IDateHelper {
    DateToString(date: Date, properties?: DateProperties): string
    DayIndexToDay(dayIndex: number): DayEnum
}
