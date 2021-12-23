import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

import { Grid, Stack } from '@mui/material';
import { AnswerTable } from '../../../../../../components/Tables/AnswerTable';
import { LoadingBackdropComponent } from '../../../../../../components/Layout/LoadingBackdropComponent';
import ApiContext from '../../../../../_context';
import { BasicTabs } from '../../../../../../components/Layout/Tabs';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { Questionnaire } from '@kvalitetsit/hjemmebehandling/Models/Questionnaire';
import ICareplanService from '../../../../../../services/interfaces/ICareplanService';
import { PatientContextThumbnails } from '../../../../../../components/Cards/PatientContextThumbnails';
import IQuestionnaireService from '../../../../../../services/interfaces/IQuestionnaireService';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'


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
    const contents = this.state.loading ? <LoadingBackdropComponent/> : this.renderTabs();
    return contents;
  }

  InitializeServices() : void {
    this.careplanService = this.context.careplanService;
    this.questionnaireService = this.context.questionnaireService;
  }

  componentDidMount() : void {
    try{
      this.populateCareplans()
    } catch(error){
      this.setState(()=>{throw error})
    }
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
<Grid container>
  <Grid xs={12}>
<Stack spacing={2}>
        <PatientContextThumbnails currentCareplan={currentCareplan!}/>
        
        <Card>
        <CardContent>
        <BasicTabs 
            idOfStartTab={this.props.match.params.questionnaireId}
            tabIds={questionnaires.map(x=>x.id)}
            tabLabels={questionnaires.map(x=>x.name)}
            tabContent={questionnaires.map(x=>this.renderQuestionnaireResponseTab(currentCareplan!,x))}
            class="questionnaire__tab"
            >
              
          </BasicTabs>
        
        </CardContent>
        </Card>
        
      </Stack>
  </Grid>
</Grid>
      
</>

      
    );
  }

  //=====================TABS===============================

  renderQuestionnaireResponseTab(careplan : PatientCareplan, questionnaire : Questionnaire) : JSX.Element{
    return (
      <>
          

      <ErrorBoundary rerenderChildren={false}>
      <AnswerTable careplan={careplan} questionnaires={questionnaire} />
      </ErrorBoundary>
    </>
    )
  }

  renderChartsTab() : JSX.Element {
    return (
      <div>charts</div>
    )
  }


  
  }
  