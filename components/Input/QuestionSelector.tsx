import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { FormControl, FormHelperText, InputLabel } from '@mui/material';
import { Question, QuestionTypeEnum } from '@kvalitetsit/hjemmebehandling/Models/Question';
import { EnableWhen } from '@kvalitetsit/hjemmebehandling/Models/EnableWhen';
import { InvalidInputModel, CriticalLevelEnum } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';

export interface Props {
    sectionName: string;
    allQuestions: Question[] | undefined
    enableWhen: EnableWhen<boolean>
    uniqueId: number
    updateParent?: () => void
    onValidation?: (uniqueId: number, error: InvalidInputModel[]) => void
    validate: (enableWhen: EnableWhen<boolean>) => Promise<InvalidInputModel[]>
}

export interface State {
    enableWhen: EnableWhen<boolean>
    errors: InvalidInputModel[];
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
            enableWhen: props.enableWhen,
            errors: [],
        }
        this.handleChange = this.handleChange.bind(this)
        this.validate = this.validate.bind(this)

        window.addEventListener(ValidateInputEvent.eventName, async (event: Event) => {
            const data = (event as CustomEvent).detail as ValidateInputEventData
            if (props.sectionName == data.sectionName) {
                await this.validate(this.state.enableWhen);
            }
        });
    }
    async validate( enableWhen: EnableWhen<boolean>): Promise<void> {
        if (!this.props.validate)
            return;
        const errors = await this.props.validate(enableWhen);
        this.setState({errors: errors})
        if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, errors.filter(x => x.criticalLevel == CriticalLevelEnum.ERROR));
        }
    }


    render(): JSX.Element {
        let firstError: InvalidInputModel | undefined = undefined
        let hasError = false


        if (this.state.errors && this.state.errors.length !== 0) {
            firstError = this.state.errors[0];

            if (firstError.criticalLevel == CriticalLevelEnum.ERROR) {
                hasError = true;
            }
           
        }
        const options = this.props.allQuestions?.filter(q => this.supportedTypes.some(type => q.type == type));
        return (
            <FormControl sx={{ minWidth: 400 }} key={"enableWhen"} required>
                <InputLabel id="demo-simple-select-label">V??lg sp??rgsm??l</InputLabel>
                <Select 
                    defaultValue="" 
                    label="V??lg sp??rgsm??l" 
                    value={this.state.enableWhen.questionId} 
                    onChange={this.handleChange}
                    error={hasError}
                    
                >
                    {options?.map(question => {
                        return (
                            <MenuItem key={question.Id} value={question.Id}>
                                {question.question}
                            </MenuItem>
                        )
                    })}
                
                </Select>
                {hasError ? <FormHelperText error={true}>{firstError?.message}</FormHelperText> : <></>}
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
