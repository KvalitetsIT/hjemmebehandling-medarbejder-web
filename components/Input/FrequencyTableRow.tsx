import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { Component, useContext } from 'react';
import { IBackendApi } from '../../apis/IBackendApi';
import { Alert, AlertColor, Snackbar, SnackbarCloseReason, Table } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Slider, TableCell, TableRow, Typography, withStyles } from '@material-ui/core';
import { Question } from '../Models/Question';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CategoryEnum } from '../Models/CategoryEnum';
import { DayEnum, Frequency, FrequencyEnum } from '../Models/Frequency';
import { Questionnaire } from '../Models/Questionnaire';

export interface Props {
    questionnaire : Questionnaire
    firstCell? : JSX.Element
    afterChange? : () => void
}

export interface State {
    questionnaire : Questionnaire
}


export class FrequencyTableRow extends Component<Props,State> {
  static displayName = FrequencyTableRow.name;
  static contextType = ApiContext

  getAllDays() : DayEnum[]{
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

  getAllRepeated() : FrequencyEnum[]{
    return [
        FrequencyEnum.WEEKLY,
        FrequencyEnum.EVERYOTHERWEEK,
        FrequencyEnum.MONTHLY,
        FrequencyEnum.YEARLY,
        FrequencyEnum.Never        
    ]
  }

  constructor(props : Props){
      super(props);
      this.state = {
        questionnaire : props.questionnaire
      }
      
  }

  SetDays(daysSelected : string | DayEnum[]){
      let oldFre = this.state.questionnaire
      oldFre.frequency.days = daysSelected as DayEnum[];
        
      this.setState({questionnaire : oldFre})
      if(this.props.afterChange)
        this.props.afterChange()
  }
  SetFrequency(frequencySelected : string | FrequencyEnum){
    let oldFre = this.state.questionnaire
    oldFre.frequency.repeated = frequencySelected as FrequencyEnum;
      
    this.setState({questionnaire : oldFre})
    if(this.props.afterChange)
     this.props.afterChange()
}

  render () {
    return (
        <>
        <TableRow>
                <TableCell>
                  <Typography>{this.props.firstCell}</Typography>
                    
                </TableCell>
                <TableCell>
                <Select onChange={(a,b) => this.SetDays(a.target.value)} multiple value={this.state.questionnaire.frequency.days}>
                    {this.getAllDays().map(day=>{
                        return (<MenuItem key={day} value={day}>{day}</MenuItem>)
                    })}
                </Select>
                </TableCell>
                <TableCell>
                <Select onChange={(a,b) => this.SetFrequency(a.target.value)} value={this.state.questionnaire.frequency.repeated}>
              {this.getAllRepeated().map(day=>{
                  return (<MenuItem key={day} value={day}>{day}</MenuItem>)
              })}
          </Select>
                </TableCell>
                <TableCell>
                  {this.props.children}
                </TableCell>
                </TableRow>
          
        </>
    )
  }



}
