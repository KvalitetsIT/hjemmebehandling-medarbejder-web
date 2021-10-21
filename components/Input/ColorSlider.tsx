import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { Component, useContext } from 'react';
import { IBackendApi } from '../../apis/IBackendApi';
import { Alert, AlertColor, Snackbar, SnackbarCloseReason } from '@mui/material';
import ApiContext from '../../pages/_context';
import { Slider, Typography, withStyles } from '@material-ui/core';
import { Question } from '../Models/Question';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { CategoryEnum } from '../Models/CategoryEnum';

export interface Props {
    category : CategoryEnum
    values : number[]
    disabled : boolean
    onChange : (values : number[]) => void
}

export interface State {
    values : number[]
}


export class ColorSlider extends Component<Props,State> {
  static displayName = ColorSlider.name;
  static contextType = ApiContext

  getChipColorFromCategory(category : CategoryEnum){
    if(category == CategoryEnum.RED)
        return "red"
    if(category == CategoryEnum.YELLOW)
        return "yellow"
    if(category == CategoryEnum.GREEN)
        return "success"
    if(category == CategoryEnum.BLUE)
        return "blue"

    return ""

}

  constructor(props : Props){
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
          values : props.values
      }
      
  }

  handleChange (event: React.ChangeEvent<{}>, newValue: number | number[]) {
    this.setState({values : newValue as number[]})
    this.props.onChange(newValue as number[])
  };

  render () {
    return (
            <Slider
            disabled={this.props.disabled}
            onChange={this.handleChange}
            getAriaLabel={() => 'Temperature range'}
            value={this.state.values}
            valueLabelDisplay="on"/>
    )
  }



}
