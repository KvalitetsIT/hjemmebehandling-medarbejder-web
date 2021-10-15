import { AppBar, Box, Button, CircularProgress, Tooltip,Container, Divider, Drawer, Fab, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { Alert, ListItemButton, SelectChangeEvent, Skeleton } from '@mui/material';
import { withThemeCreator } from '@material-ui/styles';
import MenuIcon from "@mui/icons-material/Menu"
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd"
import { QuestionnaireResponse } from '../Models/QuestionnaireResponse';
import { IBackendApi } from '../../apis/IBackendApi';
import { CategoryEnum } from '../Models/CategoryEnum';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { QuestionnaireResponseStatus, MeasurementType } from '../Models/QuestionnaireResponse';
import { QuestionnaireResponseStatusSelect } from '../Input/QuestionnaireResponseStatusSelect';
import ApiContext from '../../pages/_context';
import { Question } from '../Models/Question';
import { Answer } from '../Models/Answer';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';

export interface Props {
    typesToShow : MeasurementType[]
    questionnaireResponses : Array<QuestionnaireResponse>
}

export interface State {
  measurementCollections : Array<QuestionnaireResponse> 
}

export class AnswerTable extends Component<Props,State> {
  static displayName = AnswerTable.name;
  static contextType = ApiContext

constructor(props : Props){
    super(props);

}

  render () {
    let contents = this.renderTableData(this.props.questionnaireResponses);
    return contents;
  }

findAnswer(desiredQuestion : Question, questionResponses : QuestionnaireResponse) : Answer | undefined {
    let answer : Answer | undefined;
    questionResponses.questions.forEach( (responseAnswer,responseQuestion) => {
        if(responseQuestion.isEqual(desiredQuestion)){
            answer = responseAnswer;
            return;
        }
    });
    return answer;
}

findAllQuestions(questionResponses : Array<QuestionnaireResponse>) : Question[]{
    let questions : Question[] = [];
    questionResponses.forEach(singleResponse => {
        let iterator = singleResponse.questions.entries();
        let element = iterator.next();
        while(!element.done){
            
            let candidate = element.value[0];
            let questionAlreadyExists = questions.some(q => q.isEqual(candidate))

            if(!questionAlreadyExists){
                questions.push(candidate)
            }
            element = iterator.next()
        }

    });
    return questions;
}

  renderTableData(questionaireResponses : Array<QuestionnaireResponse>){
        return (<>
            <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>{this.props.children}</TableCell>
            {questionaireResponses.map(collection => {
                return (
                    <TableCell>{collection.answeredTime.toDateString()}</TableCell>
                )
                
            })}
          </TableRow>
            
        </TableHead>
        <TableBody>

                    
                    {this.props.typesToShow.map(type =>{
                        return (
                            <TableRow>
                                <TableCell>
                                    <Tooltip title="Måling"><DeviceThermostatOutlinedIcon color="info"/></Tooltip> {type}
                                </TableCell>
                                {questionaireResponses.map(questionResponse => {
                                    let measurement = questionResponse.measurements.get(type);
                                    return (
                                        <TableCell>{measurement ? measurement.value : "N/A"} {measurement ? measurement.unit : "N/A"}</TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                    
                    
                    {this.findAllQuestions(questionaireResponses).map(question => {
                        return (
                            <TableRow>
                                <TableCell>
                                    <Tooltip title="Spørgsmål"><ContactSupportOutlinedIcon color="info"/></Tooltip> {question.question}
                                </TableCell>
                                
                                {questionaireResponses.map(questionResponse => {
                                    let answer = this.findAnswer(question,questionResponse);
                                    return (
                                        <TableCell>{answer?.answer ? answer.answer : "N/A"}</TableCell>
                                    )
                                })}
                            </TableRow>
                        )
                    })}
                        
                        
                        
                        
                    

    
<TableRow>
<TableCell></TableCell>
            {questionaireResponses.map(questionResponse => {
                return (
                    
                    <TableCell>
                        <QuestionnaireResponseStatusSelect questionnaireResponse={questionResponse} />
                    </TableCell>
                )
                
            })}
             </TableRow>         
        </TableBody>
      </Table>
    </TableContainer>
    </>
        )
  }
}
