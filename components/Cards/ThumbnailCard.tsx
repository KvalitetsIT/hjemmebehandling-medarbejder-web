import {Typography } from '@material-ui/core';
import { Avatar } from '@mui/material';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { Grid } from '@mui/material';


export interface Props {
    avatar? : JSX.Element
    headline : string;
    color? : string;
    boxContent : JSX.Element
}

export class ThumbnailCard extends Component<Props,{}> {
  static displayName = ThumbnailCard.name;
  
  render ()  : JSX.Element{

    const backgroundColor = this.props.color ? this.props.color : "red";
    return (
        <Card component={Box} minWidth={300}>
         <CardContent>
           <Grid container>
             <Grid className="thumbnail__icon" item xs={4}>
                  {this.props.avatar ? this.props.avatar :
                   <Avatar sx={{ bgcolor: backgroundColor, width:'100%', height:'100%' }} variant="square">
                       {this.props.boxContent}
                   </Avatar>}
             </Grid>
             <Grid item xs={8} paddingLeft={2}>
             <Typography variant="inherit">{this.props.headline}</Typography>
             {this.props.children}
             </Grid>
             </Grid>
            </CardContent>
        </Card>
    );
  }
}
