import { CircularProgress,Tooltip, Divider, Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { IBackendApi } from '../../../../apis/IBackendApi';
import { PatientDetail } from '../../../../components/Models/PatientDetail';
import { ContactCard } from '../../../../components/Cards/ContactCard';
import { FormatItalic } from '@mui/icons-material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import { Stack } from '@mui/material';
import HealingIcon from '@mui/icons-material/Healing';
import { AnswerTable } from '../../../../components/Tables/AnswerTable';
import { MeasurementType, QuestionnaireResponse } from '../../../../components/Models/QuestionnaireResponse';
import { LoadingComponent } from '../../../../components/Layout/LoadingComponent';
import { PatientCard } from '../../../../components/Cards/PatientCard';
import { useContext } from 'react';
import ApiContext from '../../../_context';
import { BasicTabs } from '../../../../components/Layout/Tabs';
import { PlanDefinition } from '../../../../components/Models/PlanDefinition';
import { PatientCareplan } from '../../../../components/Models/PatientCareplan';
import { PatientSimple } from '../../../../components/Models/PatientSimple';
import { Questionnaire } from '../../../../components/Models/Questionnaire';

interface State {
  loading: boolean
  careplans : PatientCareplan[]
}
interface Props {

  match : { params : {cpr : string, questionnaireId? : string} }
}
export default class QuestionnaireResponseDetails extends React.Component<Props,State> {
  static contextType = ApiContext

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        careplans : []
    }
}

  render () {
    let contents = this.state.loading ? <LoadingComponent/> : this.renderTabs();
    console.log("CPR CPR CPR "+this.props.match.params.cpr)
    console.log("ID ID ID  "+this.props.match.params.questionnaireId)
    return contents;
  }


  componentDidMount(){
    this.populateCareplans()
}

async populateCareplans() {
  
  let { cpr } = this.props.match.params;
  let responses = await this.context.backendApi.GetPatientCareplans(cpr)
  this.setState({
      careplans : responses,
      loading : false
  });
}


  renderTabs() {
    let questionnaires : Questionnaire[] = []
    this.state.careplans.forEach(careplan => careplan.questionnaires.forEach(questionnaire => {
      questionnaires.push(questionnaire);
    }))

    return (
<>
      <Stack display="inline-flex" spacing={2} direction="row">
        <Card>
        <CardContent>
        <BasicTabs 
            idOfStartTab={this.props.match.params.questionnaireId}
            tabIds={questionnaires.map(x=>x.id)}
            tabLabels={questionnaires.map(x=>x.name)}
            tabContent={questionnaires.map(x=>this.renderQuestionnaireResponseTab(x.questionnaireResponses))}
            />
        
        </CardContent>
        </Card>
        
        
        
        
      </Stack>
</>

      
    );
  }

  //=====================TABS===============================

  renderQuestionnaireResponseTab(questionnaireResponses : QuestionnaireResponse[]){
    return (
      <AnswerTable typesToShow={[MeasurementType.CRP, MeasurementType.WEIGHT, MeasurementType.TEMPERATURE]} questionnaireResponses={questionnaireResponses} >
    
    </AnswerTable>
    )
  }

  renderChartsTab(){
    return (
      <div>charts</div>
    )
  }


  
  }
  