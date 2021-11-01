import { Avatar, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useParams } from 'react-router-dom';
import { IBackendApi } from '../../apis/IBackendApi';
import { PatientDetail } from '../Models/PatientDetail';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import StarIcon from '@mui/icons-material/Star';
import ContactPageIcon from '@mui/icons-material/ContactPage';
import Stack from '@mui/material/Stack';
import ContactPhoneIcon from '@mui/icons-material/ContactPhone';


export interface Props {
    contact? : Contact;
    headline : string;
    color : string;
    boxContent : JSX.Element
}

export interface State {
    
}

export class ContactThumbnail extends Component<Props,State> {
  static displayName = ContactThumbnail.name;

  render () {
      let contact = this.props.contact;
    return (
        <Card component={Box} minWidth={100}>
            <CardContent>
               <Stack direction="row" spacing={3}>
                    <Avatar component={Box} padding={5} bgcolor={this.props.color} variant="rounded">
                        {this.props.boxContent}
                    </Avatar>
                    <Stack spacing={1}>
                        <Typography variant="inherit">{this.props.headline}</Typography>
                        <Typography variant="subtitle2">{contact?.fullname}</Typography>
                        <Typography variant="subtitle1">{contact?.primaryPhone}</Typography>
                    </Stack>
               </Stack>
            </CardContent>
        </Card>
    );
  }
}
