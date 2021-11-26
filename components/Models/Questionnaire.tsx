import { Frequency } from "./Frequency";
import { ThresholdCollection } from "./ThresholdCollection";

export class Questionnaire {
    id! : string;
    name!: string;
    frequency!: Frequency;
    thresholds!: ThresholdCollection[];
}