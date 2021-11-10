import React from "react";
import { PatientCareplan } from "../../components/Models/PatientCareplan";



export default interface IDateHelper {
    DateToString : (date : Date) => string
    DayIndexToDay : (dayIndex : number) => string
}
  