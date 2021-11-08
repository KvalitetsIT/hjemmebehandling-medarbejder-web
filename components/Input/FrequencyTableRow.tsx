import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { TableCell, TableRow, Typography } from '@material-ui/core';
import { DayEnum, FrequencyEnum } from '../Models/Frequency';
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

  SetDays(daysSelected : string | DayEnum[]) : void{
    const oldFre = this.state.questionnaire
      oldFre.frequency.days = daysSelected as DayEnum[];
        
      this.setState({questionnaire : oldFre})
      if(this.props.afterChange)
        this.props.afterChange()
  }
  SetFrequency(frequencySelected : string | FrequencyEnum):void{
    const oldFre = this.state.questionnaire
    oldFre.frequency.repeated = frequencySelected as FrequencyEnum;
      
    this.setState({questionnaire : oldFre})
    if(this.props.afterChange)
     this.props.afterChange()
}

  render () : JSX.Element{
    return (
        <>
        <TableRow>
                <TableCell>
                  <Typography>{this.props.firstCell}</Typography>
                    
                </TableCell>
                <TableCell>
                <Select onChange={(a) => this.SetDays(a.target.value)} multiple value={this.state.questionnaire.frequency.days}>
                    {this.getAllDays().map(day=>{
                        return (<MenuItem key={day} value={day}>{day}</MenuItem>)
                    })}
                </Select>
                </TableCell>
                <TableCell>
                <Select onChange={(a) => this.SetFrequency(a.target.value)} value={this.state.questionnaire.frequency.repeated}>
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
