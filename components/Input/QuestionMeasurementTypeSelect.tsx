import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, InputLabel } from '@mui/material';
import { Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { MeasurementType } from '@kvalitetsit/hjemmebehandling/Models/MeasurementType';
import { IQuestionAnswerService } from '../../services/interfaces/IQuestionAnswerService';

export interface Props {
    question: Question
    forceUpdate?: () => void
}

export interface State {
    question: Question
    allMeasurementTypes: MeasurementType[]
}

export class QuestionMeasurementTypeSelect extends Component<Props, State> {
    static displayName = QuestionMeasurementTypeSelect.name;
    static contextType = ApiContext
    questionAnswerService!: IQuestionAnswerService

    constructor(props: Props) {
        super(props);
        this.state = {
            question: props.question,
            allMeasurementTypes: []
        }
        this.handleChange = this.handleChange.bind(this)
    }

    forceTypeSelectUpdate(): void {
        if (this.props.forceUpdate)
            this.props.forceUpdate()
        this.forceUpdate();
    }

    initialiseServices(): void {
        this.questionAnswerService = this.context.questionAnswerService
    }
    async componentDidMount(): Promise<void> {
        try {
            const measurementTypes = await this.questionAnswerService.GetAllMeasurementTypes();
            this.setState({ allMeasurementTypes: measurementTypes })
        } catch (error) {
            this.setState(() => { throw error })
        }
    }

    render(): JSX.Element {
        this.initialiseServices();

        return (
            <FormControl sx={{ minWidth: 200 }} required>
                <InputLabel id="demo-simple-select-label">Vælg målingstype</InputLabel>
                <Select label="Vælg målingstype" value={this.state.question.measurementType ?? ""} onChange={this.handleChange}>
                    {this.state.allMeasurementTypes.map((type) => {
                        return (
                            <MenuItem key={type.displayName} value={type as any}>{type.displayName}</MenuItem>
                        )
                    })}
                </Select>
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<MeasurementType | string>): void {
        const clicked = e.target.value as unknown as MeasurementType
        console.log(clicked)
        const newQuestion = this.state.question
        newQuestion.measurementType = clicked;
        this.forceTypeSelectUpdate();
        this.setState({ question: newQuestion })
    }
}
