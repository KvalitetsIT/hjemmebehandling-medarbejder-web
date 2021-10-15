import { AppBar, Box, Button, CircularProgress, Container, Divider, Drawer, Fab, Grid, IconButton, List, ListItem, ListItemText, ListSubheader, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { Alert, ListItemButton, Skeleton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { IBackendApi } from '../../apis/IBackendApi';
import { CategoryEnum } from '../Models/CategoryEnum';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Backdrop from '@mui/material/Backdrop';
import { LoadingComponent } from '../Layout/LoadingComponent';
import ApiContext from '../../pages/_context';
import { isContext } from 'vm';
import { Questionnaire } from '../Models/Questionnaire';

export interface Props {
    categories : Array<CategoryEnum>
    pageSize : number
}

export interface State {
  questionnaires : Array<Questionnaire>
  loading : boolean
}

export class Tasklist extends Component<Props,State> {
  static displayName = Tasklist.name;
  static contextType = ApiContext

constructor(props : Props){
    super(props);

    this.state = {
        questionnaires : [],
        loading : true

    }
}

  render () {
    let contents = this.state.loading ? <Skeleton variant="rectangular" height={400} /> : this.renderTableData(this.state.questionnaires);
    return contents;
  }

  componentDidMount(){
      this.populateQuestionnaireResponses()
  }

  async  populateQuestionnaireResponses() {

    let responses = await this.context.backendApi.GetPatientQuestionnaires(this.props.categories,1,this.props.pageSize);
    this.setState({
        questionnaires : responses,
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
  renderTableData(questionnaireResponses : Array<Questionnaire>){
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
                    {questionnaireResponses.map((questionnaire) => ( 
                        <>
                        {questionnaire.questionnaireResponses.map((questionnaireResponse) => {
                            return (
                              <TableRow
                                key={questionnaireResponse.patient.cpr}>
                                <TableCell component="th" scope="row">
                                  <Chip color={this.getChipColorFromCategory(questionnaireResponse.category)} label={this.getDanishColornameFromCategory(questionnaireResponse.category)} />
                                </TableCell>
                                <TableCell align="right">
                                  <Button  component={Link} to={"/patients/"+questionnaireResponse.patient.cpr+"/careplans"} variant="text">{questionnaireResponse.patient.name}</Button>
                                </TableCell>
                                <TableCell align="right">{questionnaireResponse.patient.cpr}</TableCell>
                                <TableCell align="right">{questionnaire.name}</TableCell>
                                <TableCell align="right">{questionnaireResponse.answeredTime.toLocaleDateString()} {questionnaireResponse.answeredTime.toLocaleTimeString()}</TableCell>
                                <TableCell align="right"></TableCell>
                                <TableCell align="right">
                                  <Button component={Link} to={"/patients/"+questionnaireResponse.patient.cpr+"/questionnaires/"+questionnaire.id} variant="contained">Se besvarelse</Button>
                              </TableCell>
                              </TableRow>
                            )
                        })}
                        </>
                      
                
              ))}
        </TableHead>
        <TableBody>
          
        </TableBody>
      </Table>
    </TableContainer>
        )
  }
}
