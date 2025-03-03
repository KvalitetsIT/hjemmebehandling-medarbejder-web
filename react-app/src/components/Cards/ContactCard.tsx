import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { PrimaryContact } from '../Models/PrimaryContact';
import { Component } from 'react';
import { Divider, Typography } from '@mui/material';

export interface Props {
    contact : PrimaryContact;
    iconTopLeftColor? : string;
    iconTopLeft? : JSX.Element;
    
}


export class ContactCard extends Component<React.PropsWithChildren<Props>,{}> {
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
                {contact.contact?.primaryPhone} {contact.contact?.secondaryPhone ? "("+contact.contact?.secondaryPhone+")" : ""}
              </Typography>
            </CardContent>
        </Card>
    );
  }
}
