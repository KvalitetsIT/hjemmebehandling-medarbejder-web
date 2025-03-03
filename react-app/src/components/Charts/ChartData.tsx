import { NumberAnswer } from "../Models/Answer";
import { CategoryEnum } from "../Models/CategoryEnum";
import { Question } from "../Models/Question";
import { QuestionnaireResponse } from "../Models/QuestionnaireResponse";
import { ThresholdCollection } from "../Models/ThresholdCollection";
import "../Helpers/extensionMethods/Date"

export interface Dataset {
    data: number[],
    label?: string,
    fill: boolean,
    datalabels: DataLabel,
    pointRadius: number,
    backgroundColor: string, // point color
    borderColor: string,
    order: number //If order is lowest, the line will be in front of other lines
}

export interface DataLabel {
    align?: string,
    color?: string,
    offset?: number, //space between point (the dot) and the number
    clip?: boolean //if true, data will be removed if outside the chart-area
}

export default class ChartData {
    answerData: number[];//Contains all numbers that should be shown in chart
    answerLabels: string[];// Contains the x-axes values (dates)
    label: string;
    numberOfResponses: number;
    thresholdCollection: ThresholdCollection | undefined;

    dateToString: (date: Date) => string;


    constructor(questionnaireResponses: QuestionnaireResponse[], question: Question, thresholdCollection: ThresholdCollection | undefined, dateToString: (date: Date) => string) {
        this.answerData = [];
        this.answerLabels = []
        this.label = question.abbreviation ?? question.question ?? "";
        this.thresholdCollection = thresholdCollection;
        this.numberOfResponses = questionnaireResponses.length
        this.dateToString = dateToString
        this.FromQuestionnaireResponsesToDataset(questionnaireResponses, question);
    }

    getChipColorFromCategory(category: CategoryEnum): string {

        const greenLight = '#D0EFDC'

        const yellowLight = '#FFEFD0'

        const redLight = '#FAD8D7'

        const transparency = 1
        if (category === CategoryEnum.RED)
            return redLight
        if (category === CategoryEnum.YELLOW)
            return yellowLight
        if (category === CategoryEnum.BLUE)
            return "rgba(75,192,192," + transparency + ")"

        return greenLight

    }

    getDisplayNameFromCategory(category: CategoryEnum): string {
        if (category === CategoryEnum.RED)
            return "Rød"
        if (category === CategoryEnum.YELLOW)
            return "Gul"
        if (category === CategoryEnum.GREEN)
            return "Grøn"
        if (category === CategoryEnum.BLUE)
            return "Blå"

        return "Ukendt"
    }

    getThresholdDatasets(showThresholds: boolean) {
        if (showThresholds == false)
            return [];

        const thresholdOptions: Array<{}> = [];
        this.thresholdCollection?.thresholdNumbers?.forEach((threshold) => {
            thresholdOptions.push({
                drawTime: 'beforeDatasetsDraw',
                type: 'box',
                yMin: threshold.from,
                yMax: threshold.to,
                borderColor: 'rgba(255, 51, 51, 0.25)',
                borderWidth: 0,
                backgroundColor: this.getChipColorFromCategory(threshold.category),
            });

        })
        return thresholdOptions;
    }

    getDataDatasets(showLabels: boolean) {
        return { // This is the question-line of the graph
            label: showLabels,
            data: this.answerData,
            fill: false,
            datalabels: {
                align: "start",
                offset: 10, //space between point (the dot) and the number
                clip: false //if true, data will be removed if outside the chart-area
            },
            pointRadius: 5,
            backgroundColor: "black", // point color
            borderColor: "black",
            order: -99999 //If order is lowest, the line will be in front of other lines
        }
    }
    private FromQuestionnaireResponsesToDataset(questionnaireResponses: QuestionnaireResponse[], question: Question) {
        questionnaireResponses.sort((a, b) => a.answeredTime && b.answeredTime ? a.answeredTime.compareTo(b.answeredTime) : 0)

        //Go through all responses and push answers and dates to answerData, and answerLabels
        for (let responseIndex = 0; responseIndex < questionnaireResponses.length; responseIndex++) {


            const response = questionnaireResponses[responseIndex];
            if (response && response.questions) {
                const questionnaireQuestion = Array.from(response.questions.keys()).find(x => x.Id === question.Id);
                const answer = response.questions.get(questionnaireQuestion!) as NumberAnswer | undefined

                if (answer?.answer != undefined) {
                    this.answerData.push(answer.answer)
                    this.answerLabels.push(this.dateToString(response.answeredTime!))
                }


            }
        }
    }
}
