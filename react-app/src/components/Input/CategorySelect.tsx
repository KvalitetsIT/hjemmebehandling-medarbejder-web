import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Component } from 'react';
import { FormControl, FormHelperText, Typography } from '@mui/material';
import ApiContext from '../../pages/_context';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { InputLabel} from "@mui/material";
import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';

export interface Props {
    sectionName?: string;
    category?: CategoryEnum
    onChange : (value : CategoryEnum) => void
    onValidation?: (uniqueId: string, error: InvalidInputModel[]) => void
    disabled: boolean
    uniqueId: string;
    label?: string
}

export interface State {
    category : CategoryEnum | undefined
    errors: InvalidInputModel[]
}


export class CategorySelect extends Component<Props,State> {
    static displayName = CategorySelect.name;
    static contextType = ApiContext

    constructor(props : Props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.onValidateEvent = this.onValidateEvent.bind(this)

        this.state = {
            category: props.category,
            errors: []
        }
    }

    async componentDidMount(): Promise<void> {
        window.addEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
    }


    componentWillUnmount(): void {
        window.removeEventListener(ValidateInputEvent.eventName, this.onValidateEvent);
        if (this.props.onValidation && this.state.errors.length > 0) {
            this.props.onValidation(this.props.uniqueId, []);
        }
    }

    onValidateEvent(event: Event): void {
        const data = (event as CustomEvent).detail as ValidateInputEventData

        if (this.props.sectionName === data.sectionName) {
            this.validate();
        }
    }

    async validate(): Promise<void> {
        const errors: InvalidInputModel[] = []
        if (this.state.category === undefined) {
            errors.push( new InvalidInputModel("QuestionType", "Kategori skal angives",CriticalLevelEnum.ERROR))
        }
         if (this.props.onValidation) {
            this.props.onValidation(this.props.uniqueId, errors.filter(x => x.criticalLevel === CriticalLevelEnum.ERROR));
        }
        this.setState({errors: errors}) 
    }

    getAllCategories() : CategoryEnum[] {
        return [CategoryEnum.GREEN,CategoryEnum.YELLOW,CategoryEnum.RED]
    }

    getDanishColornameFromCategory(category : CategoryEnum) : string {
        if(category === CategoryEnum.RED)
            return "Rød"
        if(category === CategoryEnum.YELLOW)
            return "Gul"
        if(category === CategoryEnum.GREEN)
            return "Grøn"

        return "Ukendt"
    }

    handleChange (event: SelectChangeEvent) : void {
        const newValue = this.getAllCategories().find(x=>x.toString() === event.target.value.toString())
        this.setState({category : newValue as CategoryEnum})
        this.props.onChange(newValue as CategoryEnum)
    }

    render () : JSX.Element{
        const hasError = this.state.errors.length > 0
        return (
            <FormControl sx={{ minWidth: 200 }} required>
                { this.props.label && <InputLabel>{this.props.label}</InputLabel>}
                <Select
                    label={this.props.label}
                    disabled={this.props.disabled}
                    labelId="demo-multiple-name-label"
                    id="demo-multiple-name"
                    value={this.state.category?.toString()}
                    onChange={this.handleChange}
                    error={hasError}
                >
                {this.getAllCategories().map((category) => (
                    <MenuItem key={category} value={category}>
                        <Typography>{this.getDanishColornameFromCategory(category)}</Typography>
                    </MenuItem>
                ))}
                </Select> 
                {hasError ? <FormHelperText error={true}>{this.state.errors[0]?.message}</FormHelperText> : <></>}
            </FormControl>
        )
    }
}
