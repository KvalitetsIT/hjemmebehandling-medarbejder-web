import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { Question } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { MeasurementType } from '@kvalitetsit/hjemmebehandling/Models/MeasurementType';
import { IQuestionAnswerService } from '../../services/interfaces/IQuestionAnswerService';

import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { MessageWithWarning } from '../Errors/MessageWithWarning';

export interface Props {
    sectionName?: string;
    question: Question
    forceUpdate?: () => void
    validate?: (value: string) => Promise<InvalidInputModel[]>
    onValidation?: (uniqueId: string, error: InvalidInputModel[]) => void
    disabled?: boolean
    uniqueId: string;
}

export interface State {
    question: Question
    allMeasurementTypes: MeasurementType[]
    errors: InvalidInputModel[]
}

export class QuestionMeasurementTypeSelect extends Component<Props, State> {
    static displayName = QuestionMeasurementTypeSelect.name;
    static contextType = ApiContext
    questionAnswerService!: IQuestionAnswerService

    constructor(props: Props) {
        super(props);
        this.state = {
            question: props.question,
            allMeasurementTypes: [],
            errors: []
        }
        this.handleChange = this.handleChange.bind(this)

        this.onValidateEvent = this.onValidateEvent.bind(this)
    }

    componentWillUnmount(): void {
        window.removeEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
        if (this.props.onValidation && this.state.errors.length > 0) {
            this.props.onValidation(this.props.uniqueId, []);
        }
    }

    onValidateEvent(event: Event): void {
        const data = (event as CustomEvent).detail as ValidateInputEventData
            
        if (this.props.sectionName == data.sectionName) {
            this.validate();
        }
    }

    async validate(): Promise<void> {
        const question = this.state.question
        const errors: InvalidInputModel[] = []
        if (question.measurementType == undefined) {
            errors.push( new InvalidInputModel("QuestionType", "Målingstype skal angives",CriticalLevelEnum.ERROR))
        }
         if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, errors.filter(x => x.criticalLevel == CriticalLevelEnum.ERROR));
        }
        this.setState({errors: errors}) 
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

        window.addEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
        this.validate();
    }

    render(): JSX.Element {
        this.initialiseServices();
        const hasError = this.state.errors.length > 0
        return (
            <FormControl sx={{ minWidth: 200 }} required>
                <InputLabel id="demo-simple-select-label">Vælg målingstype</InputLabel>
                <Select
                    label="Vælg målingstype"
                    value={this.state.question.measurementType?.code}
                    onChange={this.handleChange}
                    error={hasError}
                    disabled={this.props.disabled}
                    >
                    
                    {this.state.allMeasurementTypes.map((type) => {
                        return (
                            <MenuItem key={type.displayName} value={type.code}>{type.displayName}</MenuItem>
                        )
                    })}
                </Select>
                {hasError ? <FormHelperText error={true}><MessageWithWarning message={this.state.errors[0]?.message} /></FormHelperText> : <></>}
            </FormControl>
        )
    }

    handleChange(e: SelectChangeEvent<string>): void {
        const clickedMeasurementCode = e.target.value
        const clicked = this.state.allMeasurementTypes.find(mt => mt.code == clickedMeasurementCode);
        const newQuestion = this.state.question
        newQuestion.measurementType = clicked;
        this.forceTypeSelectUpdate();
        this.setState({ question: newQuestion })
        this.validate();
    }
}
