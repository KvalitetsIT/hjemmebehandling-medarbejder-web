import { CardHeader, CircularProgress, Divider, Grid, Tooltip, Typography } from '@material-ui/core';
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
import { PatientCareplan } from '../Models/PatientCareplan';
import { PlanDefinition } from '../Models/PlanDefinition';

export interface Props {
    careplan : PatientCareplan
}

export interface State {
    
}

export class CareplanCardSimple extends Component<Props,State> {
  static displayName = CareplanCardSimple.name;

  render () {
      let careplan = this.props.careplan
    return (
        <Card component={Box} minWidth={100}>
            {careplan.terminationDate ? 
                <CardHeader title="Inaktiv behandlingsplan"/> :
                <CardHeader title="Igangværende behandlingsplan"/>
            }
            <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={4}>
                   <Typography variant="caption">Adeling</Typography>
                   <Typography>{this.props.careplan.department}</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption">Patientgrupper</Typography>
                    {careplan.planDefinitions.map(planDefinition => {
                        return (
                            <Typography>{planDefinition.name}</Typography>
                        )
                    })}
                   
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption">Opstart</Typography>
                   <Typography>{careplan.creationDate.toLocaleDateString()+" "+careplan.creationDate.toLocaleTimeString()}</Typography>
                </Grid>
            </Grid>
            </CardContent>
        </Card>
    );
  }
}
