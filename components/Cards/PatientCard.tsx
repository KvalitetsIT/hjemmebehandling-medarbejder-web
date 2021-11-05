import { CircularProgress, Divider, emphasize, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import { PatientSimple } from '../Models/PatientSimple';
import { Accordion, AccordionDetails, AccordionSummary, Badge, Stack } from '@mui/material';
import { Skeleton } from '@mui/material';
import { ContactCard } from './ContactCard';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';

export interface Props {
    patient : PatientDetail

}

export interface State {
    loading : boolean;
}

export class PatientCard extends Component<Props,State> {
  static displayName = PatientCard.name;

  constructor(props : Props){
      super(props);
      this.state = {loading : true}
  }

  render () {
    let contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount(){
    this.setState({loading : false})
}

  renderCard(){
    let badge = (<div></div>)
    let borderPixels = 0;
    let contact = this.props.patient.contact
    return (
        <Card padding={4} component={Stack}>
            <CardHeader component={Typography} align="left" title={this.props.patient.firstname + " " +this.props.patient.lastname}/>
          <CardContent>
          
            <Stack spacing={0} >

            <Typography variant="subtitle2">
            {this.props.patient.cpr}
            </Typography>
            <Typography variant="subtitle2">
                {this.props.patient.patientContact?.address.road}<br/>
                {this.props.patient.patientContact?.address.zipCode}, {this.props.patient.patientContact?.address.city}<br/>
                {this.props.patient.patientContact?.address.country}<br/>
                <br/>
                {this.props.patient.patientContact?.primaryPhone} {this.props.patient.patientContact?.secondaryPhone ? "("+this.props.patient.patientContact?.secondaryPhone+")" : ""}<br/>
                {this.props.patient.patientContact?.emailAddress}<br/>
            </Typography>
            <br/>
          <Typography variant="button">
            Pårørende:
            </Typography>
            
     
        
       

                    {badge}
                    <Box component="span" color="info" sx={{ p: 2, border: borderPixels+'px dashed grey' }}>
                    
                    <Typography variant="subtitle2">
                    
                        {contact.fullname}
                        <br/>
                        {contact.address.road}<br/>
                        {contact.address.zipCode}<br/>
                        {contact.primaryPhone} {contact.secondaryPhone ? "("+contact.secondaryPhone+")" : ""}<br/>
                        {contact.emailAddress}<br/>
                    </Typography>
                    </Box>
                    
                    <br/>
           

      
            
           
            </Stack>
          </CardContent>
        </Card>
    )
  }
}
