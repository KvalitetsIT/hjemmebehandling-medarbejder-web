import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, InputLabel } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';

export interface Props {
    question: Question
    forceUpdate?: () => void
}

export interface State {
    question: Question
}



export class QuestionTypeSelect extends Component<Props, State> {
    static displayName = QuestionTypeSelect.name;
    static contextType = ApiContext

    allTypes: Array<{ type: QuestionTypeEnum, displayName: string }> = [
        { type: QuestionTypeEnum.BOOLEAN, displayName: "Ja / Nej" },
        { type: QuestionTypeEnum.OBSERVATION, displayName: "Måling" }
        //{ type: QuestionTypeEnum.CHOICE, displayName: "Multiplechoice" },
        //{ type: QuestionTypeEnum.INTEGER, displayName: "Heltal" },
        //{ type: QuestionTypeEnum.STRING, displayName: "Fritekst" }
    ]
    constructor(props: Props) {
        super(props);
        this.state = {
            question: props.question
        }
        this.handleChange = this.handleChange.bind(this)
    }

    forceTypeSelectUpdate() : void{
        if (this.props.forceUpdate)
            this.props.forceUpdate()
        this.forceUpdate();
    }

    render(): JSX.Element {
        return (
            <FormControl sx={{ minWidth: 200 }} required>
                <InputLabel id="demo-simple-select-label">Vælg spørgsmålstype</InputLabel>
                <Select label="Vælg spørgsmålstype" value={this.state.question.type} onChange={this.handleChange}>
                    {this.allTypes.map(type => {
                        return (
                            <MenuItem key={type.type} value={type.type}>{type.displayName}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const clicked = e.target.value as unknown as QuestionTypeEnum
        const newQuestion = this.state.question
        newQuestion.type = clicked;
        this.forceTypeSelectUpdate();
        this.setState({ question: newQuestion })

    }



}
