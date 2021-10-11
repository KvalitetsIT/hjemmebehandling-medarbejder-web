import { CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
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

export interface Props {
    contact : Contact;
}

export interface State {
    
}

export class ContactCard extends Component<Props,State> {
  static displayName = ContactCard.name;

toogleDrawer = () => {
    
  };

  render () {
      let contact = this.props.contact;
    return (
        <Card>
            <CardContent>
                <Box position="fixed" >
                {contact.favContact ? <Tooltip title="Favorit kontaktperson"><StarIcon color="info"/></Tooltip> : "" }
                </Box>
              <Box textAlign="center">
                {contact.fullname} 
                {this.props.children}
              </Box>
              
              <br/>
              <Divider/>
              <br/>
              <Typography>
                {contact.address.road}, {contact.address.zipCode}
              </Typography>
              
              <Typography>
                {contact.emailAddress}
              </Typography>
              <Typography>
                {contact.primaryPhone} {contact.secondaryPhone ? "("+contact.secondaryPhone+")" : ""}
              </Typography>
            </CardContent>
        </Card>
    );
  }
}
