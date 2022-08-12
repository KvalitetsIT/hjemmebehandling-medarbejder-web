import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum"
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber"
import { Stack, Select, MenuItem, TextField, FormControl, FormHelperText } from "@mui/material"
import React from "react"
import { ChangeEvent, Component } from "react"
import NumberFormat from "react-number-format"
import { Color } from "../Cards/PlanDefinition/PlanDefinitionEditThresholds"


interface Props {
    threshold: ThresholdNumber
    onChange: (property: string) => void
    onError: (error?: Error) => void
}
interface State {
    hasError?: Error
}



export default class ThresholdInput extends Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            hasError: undefined
        }
    }

    getChipColorFromCategory(category: CategoryEnum): Color {
        if (category === CategoryEnum.RED)
            return Color.red
        if (category === CategoryEnum.YELLOW)
            return Color.yellow
        if (category === CategoryEnum.GREEN)
            return Color.green
        return Color.grey
    }

    handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void {


        const change: ThresholdNumber = this.props.threshold;
        switch (e.target.name) {
            case "category": {
                change.category = parseInt(e.target.value) as CategoryEnum;
                break;
            }
            case "from": {
                change.from = parseFloat(e.target.value);
                break;
            }
            case "to": {
                change.to = parseFloat(e.target.value);
                break;
            }
        }
        const error = new Error("Feltet 'til' skal være større end: " + this.props.threshold.from)
        const hasError = this.props.threshold.to! <= this.props.threshold.from! ? error : undefined

        this.setState({ hasError: hasError })
        this.props.onError(hasError)
        this.props.onChange(e.target.name)
    }


    render(): JSX.Element {
        return (
            <>
                <FormControl>
                    <Stack direction="row">

                        <Select fullWidth value={this.props.threshold.category} sx={{
                            "& fieldset": {
                                borderTopRightRadius: 0,
                                borderBottomRightRadius: 0,
                            },
                            backgroundColor: this.getChipColorFromCategory(this.props.threshold.category),
                            color: "white",
                        }}
                            name="category"
                            onChange={x => this.handleValueChange(x.target.value as number, "category")}
                        >
                            <MenuItem value={CategoryEnum.RED}>Rød</MenuItem>
                            <MenuItem value={CategoryEnum.YELLOW}>Gul</MenuItem>
                            <MenuItem value={CategoryEnum.GREEN}>Grøn</MenuItem>
                        </Select>


                        <NumberFormat

                            name="from"
                            value={this.props.threshold.from}
                            decimalSeparator={","}
                            onValueChange={(x) => {
                                return this.handleValueChange(x.floatValue, "from")
                            }}
                            customInput={TextField}


                            fullWidth
                            type={"text"}
                            sx={{
                                "& fieldset": {
                                    borderRadius: 0
                                }
                            }}
                            inputProps={{
                                step: ".01",
                                style: { textAlign: 'center' },
                                inputMode: 'numeric',
                                pattern: '[0-5]*'
                            }}
                            InputLabelProps={{ shrink: false }}
                            
                        ></NumberFormat>

                        <NumberFormat
                            name="to"
                            value={this.props.threshold.to}
                            decimalSeparator={","}
                            onValueChange={(x) => {
                                return this.handleValueChange(x.floatValue, "to")
                            }}
                            customInput={TextField}
                            error={this.state.hasError ? true : false}
                            InputLabelProps={{ shrink: false }}
                            inputProps={{
                                step: ".01",
                                style: { textAlign: 'center' },

                            }}
                            sx={{
                                "& fieldset": {
                                    borderTopLeftRadius: 0,
                                    borderBottomLeftRadius: 0
                                },
                            }}
                            fullWidth
                        ></NumberFormat>

                    </Stack>

                    {this.state.hasError ? <FormHelperText sx={{ color: "red" }}>{this.state.hasError.message}</FormHelperText> : <></>}

                </FormControl>

            </>



        )
    }



    handleValueChange(x: number | undefined, fieldName: string): void {
        const change: ThresholdNumber = this.props.threshold;
        switch (fieldName) {
            case "category": {
                change.category = x as CategoryEnum;
                break;
            }
            case "from": {
                change.from = x;
                break;
            }
            case "to": {
                change.to = x;
                break;
            }
        }
        const error = new Error("Feltet 'til' skal være større end: " + this.props.threshold.from)
        const hasError = this.props.threshold.to! <= this.props.threshold.from! ? error : undefined

        this.setState({ hasError: hasError })
        this.props.onError(hasError)
        this.props.onChange(fieldName)
    }


}

 
