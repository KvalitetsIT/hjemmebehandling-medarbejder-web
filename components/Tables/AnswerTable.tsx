import { AppBar, Box, Button, CircularProgress, Tooltip,Container, Divider, Drawer, Fab, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography, Modal } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { Alert, Card, CardContent, ListItemButton, SelectChangeEvent, Skeleton } from '@mui/material';
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
import { Answer, NumberAnswer, StringAnswer } from '../Models/Answer';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import DeviceThermostatOutlinedIcon from '@mui/icons-material/DeviceThermostatOutlined';
import ContactSupportOutlinedIcon from '@mui/icons-material/ContactSupportOutlined';
import { width } from '@mui/system';
import { ThresholdModal } from '../Modals/ThresholdModal';
import { ThresholdNumber } from '../Models/ThresholdNumber';
import { ThresholdOption } from '../Models/ThresholdOption';

export interface Props {
    typesToShow : MeasurementType[]
    questionnaireResponses : Array<QuestionnaireResponse>
}

export interface State {
  thresholdModalOpen : boolean
}

export class AnswerTable extends Component<Props,State> {
  static displayName = AnswerTable.name;
  static contextType = ApiContext

constructor(props : Props){
    super(props);
    this.state = {
        thresholdModalOpen : false
    }
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

getChipColorFromCategory(category : CategoryEnum){
    if(category == CategoryEnum.RED)
        return "error"
    if(category == CategoryEnum.YELLOW)
        return "warning"
    //if(category == CategoryEnum.GREEN)
      //  return "success"
    if(category == CategoryEnum.BLUE)
        return "primary"

    return "default"

}

findCategory(question: Question, answer: Answer) : CategoryEnum {
    
    if(answer instanceof NumberAnswer){
        let answerAsNumber = answer as NumberAnswer;
        let thresholdPoint = question.thresholdPoint.find(x=>x.from <= answerAsNumber.answer && answerAsNumber.answer <= x.to);
        return thresholdPoint ? thresholdPoint.category : CategoryEnum.GREEN;
    }
    if(answer instanceof StringAnswer){
        let answerAsString = answer as StringAnswer;
        let thresholdPoint = question.options.find(x=>x.option == answerAsString.answer);
        return thresholdPoint ? thresholdPoint.category : CategoryEnum.GREEN;
    }

    return CategoryEnum.GREEN
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

updateNumberedThresholds(question : Question, threshold : ThresholdNumber){
    let thresholdToChange = question.thresholdPoint.find(existingThreshold => existingThreshold.id == threshold.id);
    thresholdToChange = threshold;
    this.forceUpdate()
}

updateOptionallyThresholds(question : Question, threshold : ThresholdOption){
    let thresholdToChange = question.options.find(existingThreshold => existingThreshold.id == threshold.id);
    thresholdToChange = threshold;
    this.forceUpdate()
}

  renderTableData(questionaireResponses : Array<QuestionnaireResponse>){
        return (<>




            <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>{this.props.children}</TableCell>
          <TableCell></TableCell>
            {questionaireResponses.map(collection => {
                return (
                    <TableCell>{collection.answeredTime ? collection.answeredTime.toDateString() : ""}</TableCell>
                )
            })}
          </TableRow>
            
        </TableHead>
        <TableBody>
                    {this.findAllQuestions(questionaireResponses).map(question => {
                        return (
                            <>
                            
                            <TableRow>
                                <TableCell>
                                    <Tooltip title="Se tærkselværdier">
                                        <ThresholdModal onThresholdOptionChange={(newThreshold) => this.updateOptionallyThresholds(question, newThreshold)} onThresholdNumberChange={(newThreshold) => this.updateNumberedThresholds(question, newThreshold)} question={question}  />
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    {question.question}                                    
                                </TableCell>
                                
                                {questionaireResponses.map(questionResponse => {
                                    let answer = this.findAnswer(question,questionResponse);
                                    let category = answer ? this.findCategory(question,answer) : CategoryEnum.GREEN;
                                    return (
                                        <TableCell> <Chip color={this.getChipColorFromCategory(category)} label={answer ? answer.ToString() : ""} variant="filled" /></TableCell>
                                    )
                                })}
                            </TableRow>
                            </>
                        )
                    })}
<TableRow>
<TableCell></TableCell>
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
