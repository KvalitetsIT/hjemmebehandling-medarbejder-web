import { AppBar, Box, Button, CircularProgress, Tooltip,Container, Divider, Drawer, Fab, FormControl, Grid, IconButton, InputLabel, List, ListItem, ListItemText, ListSubheader, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Toolbar, Typography, Modal } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component, useContext } from 'react';
import Stack from '@mui/material/Stack';
import { Alert, Badge, Card, CardContent, ListItemButton, SelectChangeEvent, Skeleton } from '@mui/material';
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
import QuestionAnswerService from '../../services/QuestionAnswerService';
import IQuestionAnswerService from '../../services/interfaces/IQuestionAnswerService';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { Questionnaire } from '../Models/Questionnaire';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export interface Props {
    typesToShow : MeasurementType[]
    questionnaires : Questionnaire
}

export interface State {
  thresholdModalOpen : boolean
}

export class AnswerTable extends Component<Props,State> {
  static displayName = AnswerTable.name;
  static contextType = ApiContext

  questionAnswerService! : IQuestionAnswerService;
  questionnaireService! : IQuestionnaireService;

constructor(props : Props){
    super(props);
    this.state = {
        thresholdModalOpen : false
    }
}

  render () {
    this.InitializeServices();
    let contents = this.renderTableData(this.props.questionnaires);
    return contents;
  }

  InitializeServices(){
    this.questionAnswerService = this.context.questionAnswerService;
    this.questionnaireService = this.context.questionnaireService;
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

getDisplayNameFromCategory(category : CategoryEnum){
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

  renderTableData(questionaire : Questionnaire){
    let questionaireResponses = questionaire.questionnaireResponses;
    if(questionaireResponses.length == 0){
        return (
            <>
            <Typography>Ingen besvarelser for spørgeskema endnu. </Typography>
            <Typography variant="caption">Spørgeskemaet besvares {questionaire.frequency.ToString()}</Typography>
            </>
        )
    }
    
    return (<>
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
          <TableCell>
          <Tooltip placement="top" title="Besvarelses frekvens for spørgeskema">
              <Typography variant="caption"> <CalendarTodayIcon fontSize="inherit"/> {questionaire.frequency.ToString()}</Typography>
            </Tooltip>
            </TableCell>
            {questionaireResponses.map(collection => {
                return (
                    <TableCell>
                    <Tooltip title={this.getDisplayNameFromCategory(collection.category)} placement="right">
                        <Badge color={this.getChipColorFromCategory(collection.category)}  badgeContent={<div></div>} >
                        
                            {collection.answeredTime ? collection.answeredTime.toDateString() : ""}
                        
                        </Badge>
                      </Tooltip>
                      </TableCell>
                    
                )
            })}
          </TableRow>
            
        </TableHead>
        <TableBody>
                    {this.questionnaireService.findAllQuestions(questionaireResponses).map(question => {
                        return (
                            <>
                            
                            <TableRow>
                                <TableCell>
                                    {question.question}                                    
                                </TableCell>
                                
                                {questionaireResponses.map(questionResponse => {
                                    let answer = this.questionnaireService.findAnswer(question,questionResponse);
                                    let category = answer ? this.questionAnswerService.FindCategory(question,answer) : CategoryEnum.GREEN;
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
