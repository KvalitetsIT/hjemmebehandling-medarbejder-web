import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext, { IApiContext } from '../../pages/_context';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { MeasurementType } from '@kvalitetsit/hjemmebehandling/Models/MeasurementType';
import { IQuestionAnswerService } from '../../services/interfaces/IQuestionAnswerService';

import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { ErrorMessage } from '../Errors/MessageWithWarning';

export interface Props {
    sectionName?: string;
    question: Question
    validate?: (value: string) => Promise<InvalidInputModel[]>
    onValidation?: (uniqueId: string, error: InvalidInputModel[]) => void
    disabled?: boolean
    uniqueId: string;
    allMeasurementTypes: MeasurementType[]
    onChange: (input: SelectChangeEvent<string>) => void;
}

export interface State {
}

export class QuestionMeasurementTypeSelect extends Component<Props, State> {
    static displayName = QuestionMeasurementTypeSelect.name;
    static contextType = ApiContext
    static error = new InvalidInputModel("QuestionType", "Målingstype skal angives", CriticalLevelEnum.ERROR);
     
        
    questionAnswerService!: IQuestionAnswerService

    constructor(props: Props) {
        super(props);
         
        this.onValidateEvent = this.onValidateEvent.bind(this)
    }

    componentWillUnmount(): void {
        window.removeEventListener(ValidateInputEvent.eventName, this.onValidateEvent);

        if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, []);
        }
    }

    onValidateEvent(event: Event): void {
        const data = (event as CustomEvent).detail as ValidateInputEventData

        if (this.props.sectionName === data.sectionName) {
            this.validate();
        }
    }

    validate(): void {        
        if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, [QuestionMeasurementTypeSelect.error]);
        }
    }

    async componentDidMount(): Promise<void> {
        window.addEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
    }

    render(): JSX.Element {
        const hasError = this.props.question.measurementType ? false: true;
        return (
            <FormControl sx={{ minWidth: 200 }} required>
                <InputLabel id="demo-simple-select-label">Vælg målingstype</InputLabel>
                <Select
                    key={this.props.uniqueId+'_measurementType'}
                    label="Vælg målingstype"
                    value={this.props.question.measurementType?.code}
                    onChange={(input) => this.props.onChange(input)}
                    error={hasError}
                    disabled={this.props.disabled}
                >

                    {this.props.allMeasurementTypes.map((type) => {
                        return (
                            <MenuItem key={type.displayName} value={type.code}>{type.displayName}</MenuItem>
                        )
                    })}
                </Select>
                {hasError ? <FormHelperText error={true}><ErrorMessage message="Målingstype skal angives" /></FormHelperText> : <></>}
            </FormControl>
        )
    }
}
