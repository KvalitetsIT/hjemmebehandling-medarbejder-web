import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Contact } from '@kvalitetsit/hjemmebehandling/Models/Contact';
import { Component } from 'react';
import { Divider, Typography } from '@mui/material';

export interface Props {
    contact : Contact;
    iconTopLeftColor? : string;
    iconTopLeft? : JSX.Element;
    children: JSX.Element;    
}


export class ContactCard extends Component<Props,{}> {
  static displayName = ContactCard.name;

  render ()  : JSX.Element{
    const contact = this.props.contact;
    return (
        <Card component={Box} minWidth={100}>
            <CardContent>
                <Box position="static" color={this.props.iconTopLeftColor} >
                {this.props.iconTopLeft}
                </Box>
              <Box textAlign="center">
                {contact.fullname} 
                {this.props.children}
              </Box>
              
              <br/>
              <Divider/>
              <br/>
              
              <Typography>
                {contact.primaryPhone} {contact.secondaryPhone ? "("+contact.secondaryPhone+")" : ""}
              </Typography>
            </CardContent>
        </Card>
    );
  }
}
