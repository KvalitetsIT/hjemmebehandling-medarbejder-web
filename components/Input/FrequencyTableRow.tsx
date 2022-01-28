import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { TableCell, TableRow, Typography } from '@material-ui/core';
import { DayEnum, FrequencyEnum } from '@kvalitetsit/hjemmebehandling/Models/Frequency';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { TextField } from '@mui/material';
import daLocale from 'date-fns/locale/da';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';

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


export class FrequencyTableRow extends Component<Props, State> {
  static displayName = FrequencyTableRow.name;
  static contextType = ApiContext

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

    return this.renderContent();
  }

  renderContent(): JSX.Element {
    return (
      <>
        <TableRow>
          <TableCell>
            <Typography>{this.props.firstCell}</Typography>

          </TableCell>
          <TableCell>
            <Select onChange={(a) => this.SetDays(a.target.value)} multiple value={this.state.questionnaire.frequency!.days}>
              {this.getAllDays().map(day => {
                return (<MenuItem key={day} value={day}>{day}</MenuItem>)
              })}
            </Select>
          </TableCell>
          <TableCell>
            <Select onChange={(a) => this.SetFrequency(a.target.value)} value={this.state.questionnaire.frequency!.repeated}>
              {this.getAllRepeated().map(day => {
                return (<MenuItem key={day} value={day}>{day}</MenuItem>)
              })}
              
            </Select>
          </TableCell>
          <TableCell>
            <LocalizationProvider locale={daLocale} dateAdapter={AdapterDateFns}>
              <TimePicker

                disabled
                label="Seneste besvarelses tidspunkt"
                value={this.state.deadineTime}
                onChange={() => { console.log("Deadline cannot be changed!") }}
                renderInput={(params) => <TextField {...params} />}
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
