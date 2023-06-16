"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CategoryEnum_1 = require("../Models/CategoryEnum");
require("../Helpers/extensionMethods/Date");
class ChartData {
    constructor(questionnaireResponses, question, thresholdCollection, dateToString) {
        var _a, _b;
        this.answerData = [];
        this.answerLabels = [];
        this.label = (_b = (_a = question.abbreviation) !== null && _a !== void 0 ? _a : question.question) !== null && _b !== void 0 ? _b : "";
        this.thresholdCollection = thresholdCollection;
        this.numberOfResponses = questionnaireResponses.length;
        this.dateToString = dateToString;
        this.FromQuestionnaireResponsesToDataset(questionnaireResponses, question);
    }
    getChipColorFromCategory(category) {
        const greenLight = '#D0EFDC';
        const yellowLight = '#FFEFD0';
        const redLight = '#FAD8D7';
        const transparency = 1;
        if (category === CategoryEnum_1.CategoryEnum.RED)
            return redLight;
        if (category === CategoryEnum_1.CategoryEnum.YELLOW)
            return yellowLight;
        if (category === CategoryEnum_1.CategoryEnum.BLUE)
            return "rgba(75,192,192," + transparency + ")";
        return greenLight;
    }
    getDisplayNameFromCategory(category) {
        if (category === CategoryEnum_1.CategoryEnum.RED)
            return "Rød";
        if (category === CategoryEnum_1.CategoryEnum.YELLOW)
            return "Gul";
        if (category === CategoryEnum_1.CategoryEnum.GREEN)
            return "Grøn";
        if (category === CategoryEnum_1.CategoryEnum.BLUE)
            return "Blå";
        return "Ukendt";
    }
    getThresholdDatasets(showThresholds) {
        var _a, _b;
        if (showThresholds == false)
            return [];
        const thresholdOptions = [];
        (_b = (_a = this.thresholdCollection) === null || _a === void 0 ? void 0 : _a.thresholdNumbers) === null || _b === void 0 ? void 0 : _b.forEach((threshold) => {
            thresholdOptions.push({
                drawTime: 'beforeDatasetsDraw',
                type: 'box',
                yMin: threshold.from,
                yMax: threshold.to,
                borderColor: 'rgba(255, 51, 51, 0.25)',
                borderWidth: 0,
                backgroundColor: this.getChipColorFromCategory(threshold.category),
            });
        });
        return thresholdOptions;
    }
    getDataDatasets(showLabels) {
        return {
            label: showLabels,
            data: this.answerData,
            fill: false,
            datalabels: {
                align: "start",
                offset: 10,
                clip: false //if true, data will be removed if outside the chart-area
            },
            pointRadius: 5,
            backgroundColor: "black",
            borderColor: "black",
            order: -99999 //If order is lowest, the line will be in front of other lines
        };
    }
    FromQuestionnaireResponsesToDataset(questionnaireResponses, question) {
        questionnaireResponses.sort((a, b) => a.answeredTime && b.answeredTime ? a.answeredTime.compareTo(b.answeredTime) : 0);
        //Go through all responses and push answers and dates to answerData, and answerLabels
        for (let responseIndex = 0; responseIndex < questionnaireResponses.length; responseIndex++) {
            const response = questionnaireResponses[responseIndex];
            if (response && response.questions) {
                const questionnaireQuestion = Array.from(response.questions.keys()).find(x => x.isEqual(question));
                const answer = response.questions.get(questionnaireQuestion);
                if ((answer === null || answer === void 0 ? void 0 : answer.answer) != undefined) {
                    this.answerData.push(answer.answer);
                    this.answerLabels.push(this.dateToString(response.answeredTime));
                }
            }
        }
    }
}
exports.default = ChartData;
