
import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import { PatientAvatar } from '../../components/Avatars/PatientAvatar';
import { Component } from 'react';
import { CardHeader, Divider, Grid, Stack, Typography } from '@mui/material';
import { Skeleton, Tooltip } from '@mui/material';
import ApiContext from '../../pages/_context';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import { PencilIcon } from '../Icons/Icons';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard';
import { PrimaryContact } from '@kvalitetsit/hjemmebehandling/Models/PrimaryContact';
export interface Props {
  patient: PatientDetail

}

export interface State {
  loading: boolean;
}

export class PatientCard extends Component<Props, State> {
  static displayName = PatientCard.name;
  static contextType = ApiContext

  constructor(props: Props) {
    super(props);
    this.state = { loading: true }
  }

  render(): JSX.Element {
    const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount(): void {
    this.setState({ loading: false })
  }

  renderCard(): JSX.Element {
    const primaryContact = this.props.patient.primaryContact as PrimaryContact
    return (
      <Card>


        <CardHeader
          avatar={<PatientAvatar patient={this.props.patient} />}
          title={
            <>
              <Typography>
                {this.props.patient.firstname} {this.props.patient.lastname} <br />
                {this.props.patient.cprToString()}
              </Typography>
              <Typography variant="subtitle2">
                {this.props.patient.contact?.primaryPhonenumberToString()}<br />
                {this.props.patient.contact?.secondaryPhone ? "(" + this.props.patient.contact?.secondaryPhonenumberToString() + ")" : ""}
              </Typography>
            </>
          }
          action={
            <Stack>
              <ErrorBoundary>
                <Tooltip title='Rediger patient' placement='right'>
                  <Button component={Link} to={"/patients/" + this.props.patient.cpr + "/edit"}>
                    <PencilIcon />
                  </Button>
                </Tooltip>
              </ErrorBoundary>
              <ErrorBoundary>

              </ErrorBoundary>
            </Stack>
          }
        />

        <Divider />
        <CardContent>
          <Grid container>
            <Grid item xs={12}>
              <Typography fontWeight="bold" variant="subtitle2">
                Adresse
              </Typography>
              <IsEmptyCard object={this.props.patient.contact?.address?.street} jsxWhenEmpty="Ingen adresse">

                <Typography variant="subtitle2">
                  {this.props.patient.contact?.address?.street}<br />
                  {this.props.patient.contact?.address?.zipCode}, {this.props.patient.contact?.address?.city}<br />
                  {this.props.patient.contact?.address?.country}
                </Typography>

                <br />
              </IsEmptyCard>
              <IsEmptyCard useRawJsxWhenEmpty={true} object={primaryContact?.fullname === "" ? undefined : primaryContact?.fullname} jsxWhenEmpty="">
                <Typography fontWeight="bold" variant="subtitle2">
                  Primær kontakt
                </Typography>
                <Typography variant="subtitle2">
                  {primaryContact?.fullname} {primaryContact?.affiliation ? "(" + primaryContact.affiliation + ")" : ""}
                  <br />
                  {primaryContact?.contact?.primaryPhonenumberToString()} <br />{primaryContact?.contact?.secondaryPhone ? "(" + primaryContact.contact?.secondaryPhonenumberToString() + ")" : ""}<br />
                </Typography>
              </IsEmptyCard>
            </Grid>
          </Grid>



        </CardContent>
      </Card>
    )
  }

}
