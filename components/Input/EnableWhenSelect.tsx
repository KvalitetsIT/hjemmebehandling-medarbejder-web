import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, InputLabel, Typography } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';

export interface Props {
    parentQuestion: Question
    subQuestion: Question
}

export interface State {
    subQuestion: Question
}


export class EnableWhenSelect extends Component<Props, State> {
    static displayName = EnableWhenSelect.name;
    static contextType = ApiContext

    constructor(props: Props) {
        super(props);
        this.state = {
            subQuestion: props.subQuestion
        }
        this.handleChange = this.handleChange.bind(this)
    }

    render(): JSX.Element {
        if (this.props.parentQuestion.type == QuestionTypeEnum.BOOLEAN)
            return this.renderBoolean();
        return (<Typography>Spørgsmålstype kan ikke benyttes til underspørgsmål</Typography>)
    }

    renderBoolean() : JSX.Element {
        return (
            <FormControl sx={{minWidth:150}}>
                <InputLabel id="demo-simple-select-label">Hvis overspørgsmål er</InputLabel>
                <Select label="Hvis overspørgsmål er" value={this.state.subQuestion.enableWhen?.answer + ""} onChange={this.handleChange}>
                    <MenuItem value={true+ ""}>Ja</MenuItem>
                    <MenuItem value={false+ ""}>Nej</MenuItem>
                </Select>
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const clicked = e.target.value as unknown as boolean
        console.log(clicked)
        const newQuestion = this.state.subQuestion
        newQuestion.enableWhen!.answer = clicked;

        this.setState({ subQuestion: newQuestion })

    }



}
