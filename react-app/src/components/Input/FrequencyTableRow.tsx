import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { DayEnum, FrequencyEnum } from '@kvalitetsit/hjemmebehandling/Models/Frequency';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import TimePicker from '@mui/lab/TimePicker';
import { FilledTextFieldProps, FormControl, OutlinedTextFieldProps, StandardTextFieldProps, TableCell, TableRow, TextField, TextFieldVariants, Typography } from '@mui/material';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import { MultiSelect, MultiSelectOption } from './MultiSelect';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { PlanDefinitionSelect } from './PlanDefinitionSelect';
import { IValidationService } from '../../services/interfaces/IValidationService';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export interface Props {
  questionnaire: Questionnaire
  patient: PatientDetail
  firstCell?: JSX.Element
  afterChange?: () => void
}

export interface State {
  questionnaire: Questionnaire
  deadineTime: Date
}

export class FrequencyTableRow extends Component<React.PropsWithChildren<Props>, State> {
  static displayName = FrequencyTableRow.name;
  static contextType = ApiContext

  validationService!: IValidationService
  validateEvent: ValidateInputEvent = new ValidateInputEvent(new ValidateInputEventData(PlanDefinitionSelect.sectionName))


  getAllDays(): DayEnum[] {
    return [
      DayEnum.Monday,
      DayEnum.Tuesday,
      DayEnum.Wednesday,
      DayEnum.Thursday,
      DayEnum.Friday,
      DayEnum.Saturday,
      DayEnum.Sunday
    ]
  }

  getAllRepeated(): FrequencyEnum[] {
    return [
      FrequencyEnum.WEEKLY
    ]
  }

  constructor(props: Props) {
    super(props);
    const elevenOClock = "11:00";
    const deadlineTime = new Date(0, 0, 0, 11, 0);
    props.questionnaire!.frequency!.deadline = elevenOClock
    this.state = {
      questionnaire: props.questionnaire,
      deadineTime: deadlineTime,
    }

  }

  SetDays(daysSelected: string | DayEnum[]): void {
    const oldFre = this.state.questionnaire
    oldFre.frequency!.days = daysSelected as DayEnum[];

    this.setState({ questionnaire: oldFre })
    if (this.props.afterChange)
      this.props.afterChange()
  }

  SetFrequency(frequencySelected: string | FrequencyEnum): void {
    const oldFre = this.state.questionnaire
    oldFre.frequency!.repeated = frequencySelected as FrequencyEnum;

    this.setState({ questionnaire: oldFre })
    if (this.props.afterChange)
      this.props.afterChange()
  }

  render(): JSX.Element {
    return (
      <>
        <TableRow>
          <TableCell>
            <Typography>{this.props.firstCell}</Typography>

          </TableCell>
          {/* <TableCell>
            <Select onChange={(a) => this.SetDays(a.target.value)} multiple value={this.state.questionnaire.frequency!.days}>
              {this.getAllDays().map(day => {
                return (<MenuItem key={day} value={day}>{day}</MenuItem>)
              })}
            </Select>
          </TableCell> */}

          <TableCell>

            <FormControl required>
              <MultiSelect id='frequenzy' onChange={(e, newValue) => {
                this.SetDays(newValue as unknown as Array<DayEnum>);
                this.validateEvent.dispatchEvent()
              }} value={this.state.questionnaire.frequency!.days}>
                {this.getAllDays().map(day => {
                  return <MultiSelectOption key={"option" + day} value={day}>{day}</MultiSelectOption>
                })}
              </MultiSelect>
            </FormControl>
          </TableCell>


          <TableCell>

            <Select fullWidth defaultValue={this.getAllRepeated()[0]} onChange={(a) => { this.SetFrequency(a.target.value); this.validateEvent.dispatchEvent() }} value={this.state.questionnaire.frequency!.repeated}>
              {this.getAllRepeated().map(day => {
                return (<MenuItem key={day} value={day}>{day}</MenuItem>)
              })}

            </Select>
          </TableCell>
          <TableCell>
            <LocalizationProvider adapterLocale={"da"} dateAdapter={AdapterDayjs}>
              <TimePicker
                disabled
                label="Seneste besvarelses tidspunkt"
                value={this.state.deadineTime}
                onChange={() => { console.log("Deadline cannot be changed!") }}
                renderInput={(params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined; } & Omit<FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps, "variant">) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </TableCell>
          <TableCell>
            {this.props.children}
          </TableCell>
        </TableRow>

      </>
    )
  }




}
