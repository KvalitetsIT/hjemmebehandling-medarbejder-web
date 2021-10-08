import { AppBar, Box, Button, CircularProgress, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Alert, ListItemButton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { IBackendApi } from '../../apis/IBackendApi';
import { CategoryEnum } from '../Models/CategoryEnum';

export interface Props {
    backendApi : IBackendApi
    categories : Array<CategoryEnum>
    pageSize : number
}

export interface State {
  questionnaireResponses : Array<QuestionnaireResponse>
  loading : boolean
}

export class Tasklist extends Component<Props,State> {
  static displayName = Tasklist.name;

constructor(props : Props){
    super(props);
    this.state = {
        questionnaireResponses : [],
        loading : true

    }
}

  render () {
    let contents = this.state.loading ? <CircularProgress color="inherit" /> : this.renderTableData(this.state.questionnaireResponses);
    return contents;
  }

  componentDidMount(){
      this.populateQuestionnaireResponses()
  }

  async populateQuestionnaireResponses() {

    let responses = this.props.backendApi.GetQuestionnaireResponses(this.props.categories,1,this.props.pageSize);
    this.setState({
        questionnaireResponses : responses,
        loading : false
    });
}

getChipColorFromCategory(category : CategoryEnum){
    if(category == CategoryEnum.RED)
        return "error"
    if(category == CategoryEnum.YELLOW)
        return "warning"
    if(category == CategoryEnum.GREEN)
        return "success"
    if(category == CategoryEnum.BLUE)
        return "primary"

    return "default"

}

getDanishColornameFromCategory(category : CategoryEnum){
    if(category == CategoryEnum.RED)
        return "Rød"
    if(category == CategoryEnum.YELLOW)
        return "Gul"
    if(category == CategoryEnum.GREEN)
        return "Grøn"
    if(category == CategoryEnum.BLUE)
        return "Blå"

    return "Ukendt"

}
  renderTableData(questionnaireResponses : Array<QuestionnaireResponse>){
        return (
            
            <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Kategori</TableCell>
            <TableCell align="right">Navn</TableCell>
            <TableCell align="right">CPR</TableCell>
            <TableCell align="right">Spørgeskema</TableCell>
            <TableCell align="right">Besvaret</TableCell>
            <TableCell align="right">frekvens</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
                    {questionnaireResponses.map((row) => (
                <TableRow
                  key={row.patient.cpr}>
                  <TableCell component="th" scope="row">
                    <Chip color={this.getChipColorFromCategory(row.category)} label={this.getDanishColornameFromCategory(row.category)} />
                  </TableCell>
                  <TableCell align="right">{row.patient.name}</TableCell>
                  <TableCell align="right">{row.patient.cpr}</TableCell>
                  <TableCell align="right">{row.questionnaire.name}</TableCell>
                  <TableCell align="right">{row.answeredTime.toLocaleDateString()} {row.answeredTime.toLocaleTimeString()}</TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right">
                    <Button color="inherit" variant="contained">Se mere</Button>
                </TableCell>
                </TableRow>
              ))}
        </TableHead>
        <TableBody>
          
        </TableBody>
      </Table>
    </TableContainer>
        )
  }
}
