import { CircularProgress,Tooltip, Divider, Grid, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { ContactCard } from '../../components/Cards/ContactCard';
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
import { AnswerTable } from '../../components/Tables/AnswerTable';
import { MeasurementType } from '../../components/Models/QuestionnaireResponse';
import { LoadingComponent } from '../../components/Layout/LoadingComponent';
import { PatientCard } from '../../components/Cards/PatientCard';
import { useContext } from 'react';
import ApiContext from '../_context';
import { BasicTabs } from '../../components/Layout/Tabs';

interface State {
  patient : PatientDetail
  loading: boolean
}
interface Props {

  match : { params : {cpr : string} }
}
export default class PatientDetails extends React.Component<Props,State> {
  static contextType = ApiContext

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        patient : new PatientDetail("","") // Overriden in async
    }
}

  render () {
    
    let contents = this.state.loading ? <LoadingComponent/> : this.renderTableData(this.state.patient);
    return contents;
  }

  renderTableData(patient: PatientDetail) {
    return (
<>
      <Stack display="inline-flex" spacing={2} direction="row">
      <Stack>
          <PatientCard patient={this.state.patient} />
        </Stack>
        <Card>
        <CardContent>
        <BasicTabs 
            tabLabels={["Besvarelser","Grafer","Behandlingsplan"]}
            tabContent={[
              <AnswerTable typesToShow={[MeasurementType.CRP,MeasurementType.WEIGHT,MeasurementType.TEMPERATURE]} cpr={this.state.patient.cpr} >

                <Typography variant="h6">
                  {this.state.patient.name}
                </Typography >  
              
              </AnswerTable>
            ]}
            />
        
        </CardContent>
        </Card>
        
        
        
        
      </Stack>
  


</>

      
    );
  }

  componentDidMount(){
      this.populateQuestionnaireResponses()
  }

  async populateQuestionnaireResponses() {
    
    let { cpr } = this.props.match.params;
    let responses = await this.context.backendApi.GetPatient(cpr);
    this.setState({
        patient : responses,
        loading : false
    });
}
  
  }
  