import { Avatar, Typography } from '@mui/material';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { Grid } from '@mui/material';


export interface Props {
  avatar?: JSX.Element
  headline: string;
  color?: string;
  boxContent: JSX.Element
}

export class ThumbnailCard extends Component<Props, {}> {
  static displayName = ThumbnailCard.name;

  render(): JSX.Element {

    const backgroundColor = this.props.color ? this.props.color : "red";
    return (
      <Card>
        <CardContent>
          <Grid container>
            <Grid item className="thumbnail__icon" xs="auto" >
              {this.props.avatar ? this.props.avatar :
                <Avatar sx={{ bgcolor: backgroundColor, width: '100%', height: '100%' }} variant="square">
                  {this.props.boxContent}
                </Avatar>}
            </Grid>
            <Grid item xs sx={{paddingLeft:3}}>
              <Typography className="thumbnail__headline" variant="inherit">{this.props.headline}</Typography>
              {this.props.children}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
