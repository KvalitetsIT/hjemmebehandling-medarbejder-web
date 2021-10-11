import { CircularProgress, Divider, Grid, Typography } from '@material-ui/core';
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

import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';

import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';

interface State {
  patient : PatientDetail
  loading: boolean
}
interface Props {
  backendApi : IBackendApi,
  match : { params : {cpr : string} }
}
export default class PatientDetails extends React.Component<Props,State> {

  constructor(props : Props){
    super(props);
    this.state = {
        loading : true,
        patient : new PatientDetail("","") // Overriden in async
    }
}

  render () {
    
    let contents = this.state.loading ? <CircularProgress color="inherit" /> : this.renderTableData(this.state.patient);
    return contents;
  }
  renderTableData(patient: PatientDetail) {
    return (

<>

<Box paddingBottom={2}>
          <Typography variant="h6">
              Patient
          </Typography>
          </Box>       
      <Grid container>
        <Grid item xs={7}>
          
          <Box paddingBottom={10}>
          <ContactCard contact={this.state.patient.patientContact} >
          <Typography variant="subtitle2" display="block" gutterBottom>
          {this.state.patient.cpr}
      </Typography>
          </ContactCard>
        </Box>
        </Grid>
        
        <Grid item xs={4}>
        
        </Grid>
        </Grid>
        



        <Box paddingBottom={2}>
          <Typography variant="h6">
              Kontakter
          </Typography>
          </Box>         
        <Grid container>
        
        {patient.contacts.sort( a => a.favContact ? -1 : 1 ).map(contact=>{
          return (
            <>
        
        <Grid item xs={2}>
        <Box padding={2}>
            <ContactCard contact={contact} />
        </Box>
        </Grid>
        
        </>
          )
        })}

        
      </Grid>

</>

      
    );
  }

  componentDidMount(){
      this.populateQuestionnaireResponses()
  }

  async populateQuestionnaireResponses() {
    let { cpr } = this.props.match.params;
    let responses = this.props.backendApi.GetPatient(cpr);
    this.setState({
        patient : responses,
        loading : false
    });
}
  
  }
  