"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThresholdSlider = void 0;
const React = __importStar(require("react"));
const Box_1 = __importDefault(require("@mui/material/Box"));
const react_1 = require("react");
const material_1 = require("@mui/material");
const CategoryEnum_1 = require("../Models/CategoryEnum");
class ThresholdSlider extends react_1.Component {
    constructor(props) {
        super(props);
        this.greenLight = '#D0EFDC';
        this.yellowLight = '#FFEFD0';
        this.redLight = '#FAD8D7';
        this.state = {
            questionnaireResponses: [],
            loading: true
        };
    }
    render() {
        const thresholdNumbers = this.props.threshold.sort(this.compareThresholdNumbers);
        console.log(thresholdNumbers);
        return (React.createElement(Box_1.default, { paddingRight: 5, paddingLeft: 5 },
            React.createElement(material_1.ThemeProvider, { theme: (0, material_1.createTheme)({
                    components: {
                        MuiSlider: {
                            styleOverrides: {
                                track: {
                                    background: this.generateColor(thresholdNumbers),
                                    height: 20,
                                    border: 0,
                                },
                                thumbColorPrimary: {
                                    opacity: 0
                                },
                            }
                        },
                        MuiFilledInput: {
                            styleOverrides: {
                                root: {
                                    backgroundColor: "transparent"
                                }
                            }
                        }
                    }
                }) },
                React.createElement(material_1.Slider, { disableSwap: true, sx: {
                        minHeight: 50,
                    }, key: "slider_" + this.props.question.Id, value: [
                        ...thresholdNumbers.map(x => x.from),
                        ...thresholdNumbers.map(x => x.to)
                    ], marks: [
                        ...thresholdNumbers.map(t => this.renderMarks(() => t.from)),
                        ...thresholdNumbers.map(t => this.renderMarks(() => t.to))
                    ], max: this.max(thresholdNumbers), min: this.min(thresholdNumbers), "aria-labelledby": "discrete-slider", valueLabelDisplay: "off" }))));
    }
    renderMarks(toValue) {
        const label = (React.createElement(material_1.Typography, { variant: "h6", marginTop: 5 }, toValue()));
        return { label: label, value: toValue() };
    }
    getColorFromCategory(category) {
        if (category === CategoryEnum_1.CategoryEnum.GREEN)
            return "success";
        if (category === CategoryEnum_1.CategoryEnum.YELLOW)
            return "warning";
        if (category === CategoryEnum_1.CategoryEnum.RED)
            return "error";
        return "info";
    }
    compareThresholdNumbers(a, b) {
        // a < b => Negative value
        // a == b => 0
        // a > b => Positive value
        const aFromIsUndefined = a.from === undefined;
        const aToIsUndefined = a.to === undefined;
        const bFromIsUndefined = b.from === undefined;
        const bToIsUndefined = b.to === undefined;
        if (aFromIsUndefined)
            return Number.MIN_SAFE_INTEGER;
        if (aToIsUndefined)
            return Number.MAX_SAFE_INTEGER;
        if (bFromIsUndefined)
            return Number.MAX_SAFE_INTEGER;
        if (bToIsUndefined)
            return Number.MIN_SAFE_INTEGER;
        return a.from - b.from;
    }
    generateColor(thresholdNumbers) {
        let string = "";
        const hundredPercent = this.calculatetotalAmount(thresholdNumbers);
        let latestPercentageTo = 0;
        thresholdNumbers.forEach((t) => {
            const percentageFrom = latestPercentageTo;
            let percentageTo = 1;
            if (t.to != undefined && t.from != undefined)
                percentageTo = (t.to - t.from + percentageFrom);
            latestPercentageTo = percentageTo;
            if (string != "")
                string += ", ";
            string += this.getChipColorFromCategory(t.category);
            string += " ";
            string += (percentageFrom / hundredPercent * 100) + "%";
            string += ", ";
            string += this.getChipColorFromCategory(t.category);
            string += " ";
            string += (percentageTo / hundredPercent * 100) + "%";
        });
        return "linear-gradient(90deg, " + string + ")";
    }
    calculatetotalAmount(thresholdNumbers) {
        let totalWidth = 0;
        thresholdNumbers.forEach(threshold => {
            var _a, _b;
            const to = (_a = threshold.to) !== null && _a !== void 0 ? _a : 100;
            const from = (_b = threshold.from) !== null && _b !== void 0 ? _b : -100;
            totalWidth += to - from;
        });
        return totalWidth;
    }
    min(thresholdNumbers) {
        const fromValues = thresholdNumbers.map(x => x.from);
        const min = Math.min(...fromValues);
        console.log("min");
        console.log(min);
        return min;
    }
    max(thresholdNumbers) {
        const toValues = thresholdNumbers.map(x => x.to);
        const min = Math.max(...toValues);
        console.log("min");
        console.log(min);
        return min;
    }
    getChipColorFromCategory(category) {
        if (category === CategoryEnum_1.CategoryEnum.RED)
            return this.redLight;
        if (category === CategoryEnum_1.CategoryEnum.YELLOW)
            return this.yellowLight;
        if (category === CategoryEnum_1.CategoryEnum.GREEN)
            return this.greenLight;
        return "";
    }
}
exports.ThresholdSlider = ThresholdSlider;
ThresholdSlider.displayName = ThresholdSlider.name;
