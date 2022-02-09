import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, InputLabel } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { EnableWhen } from '@kvalitetsit/hjemmebehandling/Models/EnableWhen';

export interface Props {
    allQuestions: Question[] | undefined
    enableWhen: EnableWhen<boolean>
    updateParent?: () => void
}

export interface State {
    enableWhen: EnableWhen<boolean>
}

export class QuestionSelector extends Component<Props, State> {
    static displayName = QuestionSelector.name;
    static contextType = ApiContext

    supportedTypes: Array<QuestionTypeEnum> = [
        QuestionTypeEnum.BOOLEAN
    ]
    constructor(props: Props) {
        super(props);
        this.state = {
            enableWhen: props.enableWhen
        }
        this.handleChange = this.handleChange.bind(this)
    }

    render(): JSX.Element {
        const options = this.props.allQuestions?.filter(q => this.supportedTypes.some(type => q.type == type));
        return (
            <FormControl sx={{ minWidth: 200 }} key={"enableWhen"} required>
                <InputLabel id="demo-simple-select-label">Vælg spørgsmål</InputLabel>
                <Select defaultValue="" label="Vælg spørgsmål" value={this.state.enableWhen.questionId} onChange={this.handleChange}>
                    {options?.map(question => {
                        return (
                            <MenuItem key={question.Id} value={question.Id}>{question.question}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const clicked = e.target.value as unknown as string
        const enableWhenModified = this.state.enableWhen;
        enableWhenModified.questionId = clicked;
        if(this.props.updateParent)
            this.props.updateParent();
        this.setState({ enableWhen: enableWhenModified })
    }

}
