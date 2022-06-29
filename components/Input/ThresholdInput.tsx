import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum"
import { ThresholdNumber } from "@kvalitetsit/hjemmebehandling/Models/ThresholdNumber"
import { Stack, Select, MenuItem, TextField } from "@mui/material"
import { ChangeEvent, Component } from "react"
import { Color } from "../Cards/PlanDefinition/PlanDefinitionEditThresholds"


interface Props {
    key: number
    max?: number
    min?: number
    threshold: ThresholdNumber
    onChange: (index: number, state: ThresholdNumber) => void
}

export default class ThresholdInput extends Component<Props, {}> {

    constructor(props: Props) {
        super(props)
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

    handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void{

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

        //change[e.target.name as keyof change] = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value


        this.props.onChange(this.props.key, change)
    }


    render(): JSX.Element{
        console.log("Range:", this.props.min, this.props.max)
        return (
            <>
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
                        onChange={x => this.handleChange(x as ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)}
                    >
                        <MenuItem value={CategoryEnum.RED}>Red</MenuItem>
                        <MenuItem value={CategoryEnum.YELLOW}>Yellow</MenuItem>
                        <MenuItem value={CategoryEnum.GREEN}>Green</MenuItem>
                    </Select>
                    <TextField
                        fullWidth
                        type={"number"}
                        sx={{
                            "& fieldset": {
                                borderRadius: 0
                            }
                        }}
                        inputProps={{
                            step: ".01",
                            style: { textAlign: 'center'}
                        }}
                        InputLabelProps={{ shrink: false }}
                        onChange={(x) => this.handleChange(x)}
                        value={this.props.threshold.from}
                        name="from"
                    ></TextField>


                    <TextField
                        fullWidth
                        type={"number"}
                        sx={{
                            "& fieldset": {
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0
                            },
                        }}
                        name="to"
                        inputProps={{
                            step: ".01",
                            style: { textAlign: 'center' }
                        }}
                        InputLabelProps={{ shrink: false }}
                        value={this.props.threshold.to}
                        onChange={x => this.handleChange(x)}
                    ></TextField>
                </Stack>
            </>
        )
    }

}

