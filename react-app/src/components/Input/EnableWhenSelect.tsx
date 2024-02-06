import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, FormHelperText, InputLabel, Typography } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { EnableWhen } from '@kvalitetsit/hjemmebehandling/Models/EnableWhen';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';

export interface Props {
    parentQuestion?: Question
    //subQuestion: Question
    enableWhen: EnableWhen<boolean>
    sectionName?: string
    disabled?: boolean
}

export interface State {
  //  subQuestion: Question
    enableWhen: EnableWhen<boolean>
    errors: InvalidInputModel[]
}


export class EnableWhenSelect extends Component<Props, State> {
    static displayName = EnableWhenSelect.name;
    static contextType = ApiContext

    constructor(props: Props) {
        super(props);
        this.state = {
           // subQuestion: props.subQuestion,
            enableWhen: props.enableWhen, // ?? props.subQuestion.enableWhen
            errors:[],
        }
        this.handleChange = this.handleChange.bind(this)

        window.addEventListener(ValidateInputEvent.eventName, async (event: Event) => {
            const data = (event as CustomEvent).detail as ValidateInputEventData
            
            if (props.sectionName === data.sectionName) {
                await this.validate();
            }
        });
    }

    async validate(): Promise<void> {
        const errors: InvalidInputModel[] = []

        if (this.state.enableWhen.answer === undefined) errors.push( new InvalidInputModel("EnableWhen", "Ja/nej mangler at blive angivet"))
        
        this.setState({errors: errors})
    }


    
    render(): JSX.Element {
        if (this.props.parentQuestion?.type === QuestionTypeEnum.BOOLEAN)
            return this.renderBoolean();
        return (<Typography>Spørgsmål ikke valgt</Typography>)
    }

    renderBoolean() : JSX.Element {
        const hasError = this.state.errors.length > 0
        return (
            <FormControl sx={{minWidth:200}}>
                <InputLabel id="demo-simple-select-label">Hvis spørgsmål er</InputLabel>
                <Select 
                    defaultValue='' 
                    label="Hvis spørgsmål er" 
                    value={this.state.enableWhen?.answer?.toString() ?? ""} 
                    onChange={this.handleChange}
                    error = {hasError}
                    disabled={this.props.disabled}
                    >
                    <MenuItem value={true.toString()}>Ja</MenuItem>
                    <MenuItem value={false.toString()}>Nej</MenuItem>
                </Select>
                {hasError ? <FormHelperText error={true}>{this.state.errors[0].message}</FormHelperText> : <></>}
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const clicked = e.target.value as unknown as boolean
        const newEnableWhen = this.state.enableWhen
        newEnableWhen!.answer = clicked;

        this.setState({ enableWhen: newEnableWhen })
        this.validate()
    }



}
