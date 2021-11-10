import { Typography } from '@material-ui/core';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { PatientDetail } from '../../components/Models/PatientDetail';
import { PatientAvatar } from '../../components/Avatars/PatientAvatar';
import { Component } from 'react';
import { Divider, Stack } from '@mui/material';
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
            <CardHeader component={Typography} align="left"/>

          <CardContent>
            <Stack spacing={2}>
            <Stack direction="row" spacing={3}>
              <PatientAvatar size={80} patient={this.props.patient} />
              <Stack>
              <Typography>
                {this.props.patient.firstname} {this.props.patient.lastname} <br/>
                {this.props.patient.cpr}
              </Typography>
              <Typography variant="subtitle2">
              {this.props.patient.patientContact?.primaryPhone} {this.props.patient.patientContact?.secondaryPhone ? "("+this.props.patient.patientContact?.secondaryPhone+")" : ""}
              </Typography>
              </Stack>
              
            </Stack>
            <Divider/>

            <Typography variant="subtitle2">
                {this.props.patient.patientContact?.address.road}<br/>
                {this.props.patient.patientContact?.address.zipCode}, {this.props.patient.patientContact?.address.city}<br/>
                {this.props.patient.patientContact?.address.country}<br/>
                {this.props.patient.patientContact?.emailAddress}
                
                
            </Typography>
            <Typography variant="overline">
                        Kontakt
                    </Typography>
            <Typography variant="subtitle2">
                        {contact.fullname}
                        <br/>
                        {contact.address?.road}<br/>
                        {contact.address?.zipCode}<br/>
                        {contact.primaryPhone} {contact.secondaryPhone ? "("+contact.secondaryPhone+")" : ""}<br/>
                        {contact.emailAddress}<br/>
                    </Typography>
            </Stack>
          </CardContent>
          <CardActions>
          <Button component={Link} to={"/patients/"+this.props.patient.cpr+"/edit"}>Ændr <ModeEditOutlineIcon fontSize="inherit"/> </Button>
          </CardActions>
        </Card>
    )
  }
}
