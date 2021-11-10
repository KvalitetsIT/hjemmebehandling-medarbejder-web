import { Avatar, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Contact } from '../Models/Contact';
import { Component } from 'react';
import Stack from '@mui/material/Stack';


export interface Props {
    contact? : Contact;
    avatar? : JSX.Element
    headline : string;
    color? : string;
    boxContent : JSX.Element
}

export class ContactThumbnail extends Component<Props,{}> {
  static displayName = ContactThumbnail.name;

  render ()  : JSX.Element{
    const contact = this.props.contact;
    return (
        <Card component={Box} minWidth={100}>
            <CardContent>
               <Stack direction="row" spacing={3}>
                   {this.props.avatar ? this.props.avatar :
                   
                    <Avatar component={Box} padding={5} bgcolor={this.props.color ? this.props.color : "red" } variant="square">
                        {this.props.boxContent}
                    </Avatar>}
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
