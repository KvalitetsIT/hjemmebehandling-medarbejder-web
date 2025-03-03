import * as React from 'react';
import Box from '@mui/material/Box';
import { Component } from 'react';
import { createTheme, Slider, ThemeProvider, Typography } from '@mui/material';
import { ThresholdNumber } from '../Models/ThresholdNumber';
import { Question } from '../Models/Question';
import { CategoryEnum } from '../Models/CategoryEnum';

export interface Props {
    question: Question
    threshold: ThresholdNumber[]
    displayType?: string
}

export class ThresholdSlider extends Component<Props, {}> {
    static displayName = ThresholdSlider.name;

    constructor(props: Props) {
        super(props);
        this.state = {
            questionnaireResponses: [],
            loading: true
        }
    }



    render(): JSX.Element {
        const thresholdNumbers = this.props.threshold.sort(this.compareThresholdNumbers);
        console.log(thresholdNumbers)
        return (
                <ThemeProvider theme={createTheme({
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
                })}>
            <Box paddingRight={5} paddingLeft={5}>
                {this.props.displayType ? 
                    <Typography>{this.props.displayType}</Typography>
                    :
                    <></>
                
                }

                    <Slider
                        disableSwap
                        sx={{
                            minHeight: 50,
                        }}
                        key={"slider_" + this.props.question.Id}
                        value={[
                            ...thresholdNumbers.map(x => x.from!),
                            ...thresholdNumbers.map(x => x.to!)
                        ]}
                        marks={[
                            ...thresholdNumbers.map(t => this.renderMarks(() => t.from!)),
                            ...thresholdNumbers.map(t => this.renderMarks(() => t.to!))
                        ]}
                        max={this.max(thresholdNumbers)}
                        min={this.min(thresholdNumbers)}
                        aria-labelledby="discrete-slider"
                        valueLabelDisplay="off"
                    />
            </Box>
                </ThemeProvider>
        );
    }

    renderMarks(toValue: () => number): { label: JSX.Element, value: number } {
        const label = (
            <Typography variant="h6" marginTop={5}>{toValue()}</Typography>
        )
        return { label: label, value: toValue() }
    }

    getColorFromCategory(category: CategoryEnum): "success" | "warning" | "error" | "info" {
        if (category === CategoryEnum.GREEN)
            return "success"
        if (category === CategoryEnum.YELLOW)
            return "warning"
        if (category === CategoryEnum.RED)
            return "error"

        return "info"
    }

    compareThresholdNumbers(a: ThresholdNumber, b: ThresholdNumber): number {
        // a < b => Negative value
        // a == b => 0
        // a > b => Positive value

        const aFromIsUndefined = a.from === undefined;
        const aToIsUndefined = a.to === undefined;
        const bFromIsUndefined = b.from === undefined;
        const bToIsUndefined = b.to === undefined;

        if (aFromIsUndefined)
            return Number.MIN_SAFE_INTEGER
        if (aToIsUndefined)
            return Number.MAX_SAFE_INTEGER
        if (bFromIsUndefined)
            return Number.MAX_SAFE_INTEGER
        if (bToIsUndefined)
            return Number.MIN_SAFE_INTEGER

        return a.from! - b.from!
    }

    generateColor(thresholdNumbers: ThresholdNumber[]): string {
        let string = "";
        const hundredPercent = this.calculatetotalAmount(thresholdNumbers);

        let latestPercentageTo = 0;
        thresholdNumbers.forEach((t) => {

            const percentageFrom = latestPercentageTo
            let percentageTo = 1;
            if (t.to != undefined && t.from != undefined)
                percentageTo = (t.to - t.from + percentageFrom)

            latestPercentageTo = percentageTo

            if (string != "")
                string += ", "

            string += this.getChipColorFromCategory(t.category)
            string += " "
            string += (percentageFrom / hundredPercent * 100) + "%"
            string += ", "
            string += this.getChipColorFromCategory(t.category)
            string += " "
            string += (percentageTo / hundredPercent * 100) + "%"
        });

        return "linear-gradient(90deg, " + string + ")";
    }

    calculatetotalAmount(thresholdNumbers: ThresholdNumber[]): number {
        let totalWidth: number = 0;
        thresholdNumbers.forEach(threshold => {
            const to = threshold.to ?? 100;
            const from = threshold.from ?? -100;
            totalWidth += to - from
        })
        return totalWidth
    }
    min(thresholdNumbers: ThresholdNumber[]): number {
        const fromValues: number[] = thresholdNumbers.map(x => x.from!)
        const min = Math.min(...fromValues);
        console.log("min")
        return min;
    }
    max(thresholdNumbers: ThresholdNumber[]): number {
        const toValues: number[] = thresholdNumbers.map(x => x.to!)
        const min = Math.max(...toValues);
        return min;
    }

    greenLight = '#D0EFDC'
    yellowLight = '#FFEFD0'
    redLight = '#FAD8D7'
    getChipColorFromCategory(category: CategoryEnum): string {
        if (category === CategoryEnum.RED)
            return this.redLight
        if (category === CategoryEnum.YELLOW)
            return this.yellowLight
        if (category === CategoryEnum.GREEN)
            return this.greenLight

        return ""

    }
}
