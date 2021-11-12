import { Avatar, Typography } from '@material-ui/core';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import Stack from '@mui/material/Stack';


export interface Props {
    avatar? : JSX.Element
    headline : string;
    color? : string;
    boxContent : JSX.Element
}

export class ThumbnailCard extends Component<Props,{}> {
  static displayName = ThumbnailCard.name;

  render ()  : JSX.Element{
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
                       {this.props.children}
                    </Stack>
               </Stack>
            </CardContent>
        </Card>
    );
  }
}
