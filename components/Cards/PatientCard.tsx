import { Typography } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { PatientAvatar } from '../../components/Avatars/PatientAvatar';
import { Component } from 'react';
import { Divider, Grid, Stack } from '@mui/material';
import { Skeleton } from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';

export interface Props {
    patient : PatientDetail

}

export interface State {
    loading : boolean;
}

export class PatientCard extends Component<Props,State> {
  static displayName = PatientCard.name;

  constructor(props : Props){
      super(props);
      this.state = {loading : true}
  }

  render () : JSX.Element{
    const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount() : void{
    this.setState({loading : false})
}

  renderCard() :JSX.Element{
    const contact = this.props.patient.contact
    return (
        <Card>

          <CardContent>
            <Grid container padding={2}>
              <Grid item xs={4} paddingRight={2}>
                <PatientAvatar patient={this.props.patient} />
              </Grid>
              <Grid item xs={7}>
                <Stack>
                  <Typography>
                    {this.props.patient.firstname} {this.props.patient.lastname} <br/>
                    {this.props.patient.cpr?.slice(0,6)}-{this.props.patient.cpr?.slice(6)}
                  </Typography>
                  <Typography variant="subtitle2">
                  {this.props.patient.patientContact?.primaryPhone} {this.props.patient.patientContact?.secondaryPhone ? "("+this.props.patient.patientContact?.secondaryPhone+")" : ""}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={1}>
              <Button component={Link} to={"/patients/"+this.props.patient.cpr+"/edit"}><ModeEditOutlineIcon fontSize="inherit"/> </Button>
              </Grid>
            </Grid>
            
            <Divider />
            <Grid container padding={2}>
              <Grid item xs={12}>
              <Typography variant="subtitle2">
                {this.props.patient.patientContact?.address.road}<br/>
                {this.props.patient.patientContact?.address.zipCode}, {this.props.patient.patientContact?.address.city}<br/>
                {this.props.patient.patientContact?.address.country}
            </Typography>
            <br/>
            <Typography variant="button">
                        Kontakt
                    </Typography>
            <Typography variant="subtitle2">
                        {contact.fullname}
                        <br/>
                        {contact.primaryPhone} {contact.secondaryPhone ? "("+contact.secondaryPhone+")" : ""}<br/>
                    </Typography>
              </Grid>
            </Grid>
            

            
          </CardContent>
        </Card>
    )
  }
}
