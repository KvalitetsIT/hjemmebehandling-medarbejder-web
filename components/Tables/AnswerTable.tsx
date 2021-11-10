import { Tooltip,Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import { Badge } from '@mui/material';
import { CategoryEnum } from '../Models/CategoryEnum';
import { MeasurementType } from '../Models/QuestionnaireResponse';
import { QuestionnaireResponseStatusSelect } from '../Input/QuestionnaireResponseStatusSelect';
import ApiContext from '../../pages/_context';
import IQuestionAnswerService from '../../services/interfaces/IQuestionAnswerService';
import IQuestionnaireService from '../../services/interfaces/IQuestionnaireService';
import { Questionnaire } from '../Models/Questionnaire';


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

  render () : JSX.Element{
    this.InitializeServices();
    const contents = this.renderTableData(this.props.questionnaires);
    return contents;
  }

  InitializeServices() : void{
    this.questionAnswerService = this.context.questionAnswerService;
    this.questionnaireService = this.context.questionnaireService;
  }

getChipColorFromCategory(category : CategoryEnum) : "error" | "warning"|"primary" | "default"{
    if(category === CategoryEnum.RED)
        return "error"
    if(category === CategoryEnum.YELLOW)
        return "warning"
    //if(category === CategoryEnum.GREEN)
      //  return "success"
    if(category === CategoryEnum.BLUE)
        return "primary"

    return "default"
}

getDisplayNameFromCategory(category : CategoryEnum) : string {
    if(category === CategoryEnum.RED)
        return "Rød"
    if(category === CategoryEnum.YELLOW)
        return "Gul"
    if(category === CategoryEnum.GREEN)
        return "Grøn"
    if(category === CategoryEnum.BLUE)
        return "Blå"

    return "Ukendt"
}

  renderTableData(questionaire : Questionnaire) : JSX.Element{
    const questionaireResponses = questionaire.questionnaireResponses;
    if(!questionaireResponses || questionaireResponses.length === 0){
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
                                    const answer = this.questionnaireService.findAnswer(question,questionResponse);
                                    const category = answer ? this.questionAnswerService.FindCategory(question,answer) : CategoryEnum.GREEN;
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
