import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { ThresholdNumber } from "../../components/Models/ThresholdNumber";
import { ThresholdOption } from "../../components/Models/ThresholdOption";

export default class BaseMapper{
    CreateOption(id : string, value : string,category : CategoryEnum) : ThresholdOption{
        let option = new ThresholdOption();
        option.option = value;
        option.category = category;
        option.id = id
        return option;
    }

    CreateThresholdNumber(id : string, valueLow : number, valueHigh : number, category : CategoryEnum) : ThresholdNumber {
        let number = new ThresholdNumber();
        number.from = valueLow;
        number.to = valueHigh;
        number.category = category;
        number.id = id
        return number;
    }
}