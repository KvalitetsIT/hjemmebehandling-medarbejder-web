import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Component } from 'react';
import { PatientCareplan } from '../Models/PatientCareplan';
import { CardHeader, Typography } from '@mui/material';
import { FinishCareplanButton } from '../Input/FinishCareplanButton';
import IDateHelper from '../../globalHelpers/interfaces/IDateHelper';
import ApiContext from '../../pages/_context';

export interface Props {
    careplan : PatientCareplan
}


export class CareplanSummary extends Component<Props,{}> {
  static displayName = CareplanSummary.name;
  static contextType = ApiContext;
  dateHelper! : IDateHelper

  InitialiseServices(){
      this.dateHelper = this.context.dateHelper;
  }
  render ()  : JSX.Element{
      this.InitialiseServices()
      const careplan = this.props.careplan;
    return (
        <Card component={Box} minWidth={100}>
            <CardHeader subheader="Monitoreringsplan"/>
            <CardContent>
                <Typography variant="caption">
                    Afdeling
                </Typography>
                <Typography>
                    {careplan.department}
                </Typography>
                <br/>
                <Typography variant="caption">
                    Patientgrupper
                </Typography>
                <Typography>
                {careplan.planDefinitions.map(x=>x.name).join(", ")}
                </Typography>
                <br/>
                <Typography variant="caption">
                    Opstart
                </Typography>
                <Typography>
                    {this.dateHelper.DateToString( careplan.creationDate)}
                </Typography>
                <br/>
                <FinishCareplanButton careplan={careplan}/>
            </CardContent>
        </Card>
    );
  }
}
