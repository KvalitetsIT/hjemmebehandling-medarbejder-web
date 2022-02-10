import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, InputLabel, Typography } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { EnableWhen } from '@kvalitetsit/hjemmebehandling/Models/EnableWhen';

export interface Props {
    parentQuestion?: Question
    //subQuestion: Question
    enableWhen: EnableWhen<boolean>
}

export interface State {
  //  subQuestion: Question
    enableWhen: EnableWhen<boolean>
}


export class EnableWhenSelect extends Component<Props, State> {
    static displayName = EnableWhenSelect.name;
    static contextType = ApiContext

    constructor(props: Props) {
        super(props);
        this.state = {
           // subQuestion: props.subQuestion,
            enableWhen: props.enableWhen // ?? props.subQuestion.enableWhen
        }
        this.handleChange = this.handleChange.bind(this)
    }

    render(): JSX.Element {
        if (this.props.parentQuestion?.type == QuestionTypeEnum.BOOLEAN)
            return this.renderBoolean();
        return (<Typography>Spørgsmål ikke valgt</Typography>)
    }

    renderBoolean() : JSX.Element {
        return (
            <FormControl sx={{minWidth:150}}>
                <InputLabel id="demo-simple-select-label">Hvis overspørgsmål er</InputLabel>
                <Select defaultValue='' label="Hvis overspørgsmål er" value={this.state.enableWhen?.answer?.toString() ?? ""} onChange={this.handleChange}>
                    <MenuItem value={true.toString()}>Ja</MenuItem>
                    <MenuItem value={false.toString()}>Nej</MenuItem>
                </Select>
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const clicked = e.target.value as unknown as boolean
        console.log(clicked)
        const newEnableWhen = this.state.enableWhen
        newEnableWhen!.answer = clicked;

        this.setState({ enableWhen: newEnableWhen })

    }



}