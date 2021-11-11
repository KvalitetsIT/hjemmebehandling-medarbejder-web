import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Stack } from '@mui/material';
import { AnswerTable } from '../../../../../../components/Tables/AnswerTable';
import { MeasurementType } from '../../../../../../components/Models/QuestionnaireResponse';
import { LoadingComponent } from '../../../../../../components/Layout/LoadingComponent';
import ApiContext from '../../../../../_context';
import { BasicTabs } from '../../../../../../components/Layout/Tabs';
import { PatientCareplan } from '../../../../../../components/Models/PatientCareplan';
import { Questionnaire } from '../../../../../../components/Models/Questionnaire';
import ICareplanService from '../../../../../../services/interfaces/ICareplanService';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';
import { ContactThumbnail } from '../../../../../../components/Cards/ContactThumbnail';
import { AddQuestionnaireButton } from '../../../../../../components/Input/AddQuestionnaireButton';
import IQuestionnaireService from '../../../../../../services/interfaces/IQuestionnaireService';
import { PatientAvatar } from '../../../../../../components/Avatars/PatientAvatar';

interface State {
  loading: boolean
  careplans : Array<PatientCareplan>
  editMode : boolean
}
interface Props {
  match : { params : {cpr : string, questionnaireId? : string,careplanId? : string} }
}
export default class QuestionnaireResponseDetails extends React.Component<Props,State> {
  static contextType = ApiContext
  careplanService! : ICareplanService
  questionnaireService! : IQuestionnaireService;

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        careplans : [],
        editMode : false
    }
}

  render () : JSX.Element {
    this.InitializeServices();
    const contents = this.state.loading ? <LoadingComponent/> : this.renderTabs();
    return contents;
  }

  InitializeServices() : void {
    this.careplanService = this.context.careplanService;
    this.questionnaireService = this.context.questionnaireService;
  }

  componentDidMount() : void {
    
    this.populateCareplans()
}

SetQuestionnaireFrequency(questionnaire : Questionnaire) : void{
  this.setState({editMode:false})
  this.questionnaireService.SetQuestionnaireFrequency(questionnaire);
}

async populateCareplans() : Promise<void> {
  
  const { cpr } = this.props.match.params;
  const responses = await this.careplanService.GetPatientCareplans(cpr)
  this.setState({
      careplans : responses,
      loading : false
  });
}


  renderTabs() : JSX.Element {
    
    let questionnaires : Questionnaire[] = []
    let currentCareplan = this.state.careplans.find(x=>x.id === this.props.match.params.careplanId);
    if(!currentCareplan)
      currentCareplan = this.state.careplans.find(x=>!x.terminationDate);
    
    if(currentCareplan)
      questionnaires = currentCareplan.questionnaires;  
    
    

    return (
<>
      <Stack display="inline-flex" spacing={2}>
        <Stack direction="row" spacing={2}>
        <ContactThumbnail avatar={<PatientAvatar size={80} patient={currentCareplan!.patient}/>} headline="Patient" boxContent={<HealingOutlinedIcon fontSize="large"/>} contact={currentCareplan?.patient.patientContact}></ContactThumbnail>
        <ContactThumbnail color="lightblue" headline="Primær kontakt" boxContent={<LocalPhoneOutlinedIcon fontSize="large"/>} contact={currentCareplan?.patient.contact}></ContactThumbnail>
        </Stack>
        
        <Card>
        <CardContent>
        <BasicTabs 
            idOfStartTab={this.props.match.params.questionnaireId}
            tabIds={questionnaires.map(x=>x.id)}
            tabLabels={questionnaires.map(x=>x.name)}
            tabContent={questionnaires.map(x=>this.renderQuestionnaireResponseTab(currentCareplan!,x))}
            >
              <AddQuestionnaireButton careplan={currentCareplan!} afterAddingQuestionnaire={ () => this.forceUpdate()}/>
          </BasicTabs>
        
        </CardContent>
        </Card>
        
      </Stack>
</>

      
    );
  }

  //=====================TABS===============================

  renderQuestionnaireResponseTab(careplan : PatientCareplan, questionnaire : Questionnaire) : JSX.Element{
    return (
      <>
          

      
      <AnswerTable careplan={careplan} typesToShow={[MeasurementType.CRP, MeasurementType.WEIGHT, MeasurementType.TEMPERATURE]} questionnaires={questionnaire} >
    
    </AnswerTable>
    </>
    )
  }

  renderChartsTab() : JSX.Element {
    return (
      <div>charts</div>
    )
  }


  
  }
  