import { CategoryEnum } from "./CategoryEnum";
import { PlanDefinition } from "./PlanDefinition";
import { Questionnaire } from "./Questionnaire";

//We assume that 
export class Threshold {
    points : ThresholdPoint[] = []
}

export class ThresholdPoint {

    category! : CategoryEnum
    from! : number
    to! : number

    
}
