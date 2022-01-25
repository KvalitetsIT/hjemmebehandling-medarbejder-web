import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";

export default class BaseMapper{
    CreateOption(id : string, value : string,category : CategoryEnum) : ThresholdOption{
        const option = new ThresholdOption();
        option.option = value;
        option.category = category;
        option.id = id
        return option;
    }

    CreateThresholdNumber(id : string, valueLow : number, valueHigh : number, category : CategoryEnum) : ThresholdNumber {
        const number = new ThresholdNumber();
        number.from = valueLow;
        number.to = valueHigh;
        number.category = category;
        number.id = id
        return number;
    }
}