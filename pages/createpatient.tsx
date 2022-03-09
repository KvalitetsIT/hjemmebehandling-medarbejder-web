import React, { Component } from 'react';
import { CardContent, Card, Grid, Step, StepLabel, Stepper, Typography, CardHeader, Divider } from '@mui/material';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import { Contact } from '@kvalitetsit/hjemmebehandling/Models/Contact';
import ApiContext from './_context';
import { IPatientService } from '../services/interfaces/IPatientService';
import { LoadingBackdropComponent } from '../components/Layout/LoadingBackdropComponent';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { QuestionnaireListSimple } from '../components/Cards/QuestionnaireListSimple';
import { PatientEditCard } from '../components/Cards/PatientEditCard';
import { Address } from '@kvalitetsit/hjemmebehandling/Models/Address';
import { ContactEditCard } from '../components/Cards/ContactEditCard';
import { PlanDefinitionSelect } from '../components/Input/PlanDefinitionSelect';
import { ICareplanService } from '../services/interfaces/ICareplanService';
import { Redirect } from 'react-router-dom';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import { CSSProperties } from '@material-ui/styles';
import { BaseServiceError } from '@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError'
import { ToastError } from '@kvalitetsit/hjemmebehandling/Errorhandling/ToastError'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { PatientAvatar } from '../components/Avatars/PatientAvatar';
import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { MissingContactDetailsError } from '../components/Errors/MissingContactDetailsError';
import { AccordianWrapper } from '../components/Cards/PlanDefinition/AccordianWrapper';

/**
 * 
 */
export interface Props {
  editmode: boolean,
  openAccordians?: boolean[]
  match: { params: { cpr?: string, questionnaireId?: string, careplanId?: string } }
}

export enum CreatePatientSectionsEnum {
  patientInfo,
  primaryContactInfo,
  planDefinitionInfo
}

/**
 * 
 */
export interface State {
  openAccordians: boolean[]
  patient?: PatientDetail;
  careplan?: PatientCareplan;
  newCareplanId?: string;
  loading: boolean;
  submitted: boolean
  errorToast: JSX.Element
  patientError?: string;
  contactError?: string;
  planDefinitionError?: string
  validating: boolean
}



export default class CreatePatient extends Component<Props, State> {
  static contextType = ApiContext;
  static displayName = CreatePatient.name;
  careplanService!: ICareplanService;
  patientService!: IPatientService;

  constructor(props: Props) {

    super(props);

    this.SaveCareplan = this.SaveCareplan.bind(this);

    const accordian: boolean[] = [];
    accordian[CreatePatientSectionsEnum.patientInfo] = true;
    accordian[CreatePatientSectionsEnum.primaryContactInfo] = false;
    accordian[CreatePatientSectionsEnum.planDefinitionInfo] = false;

    this.state = {
      loading: true,
      submitted: false,
      errorToast: (<></>),
      openAccordians: props.openAccordians ?? accordian,
      validating: false,
    }

  }
  InitializeServices(): void {
    this.careplanService = this.context.careplanService;
    this.patientService = this.context.patientService;
  }

  toggleAccordian(page: CreatePatientSectionsEnum, overrideExpanded?: boolean): void {
    this.closeAllAccordians();
    const oldAccordians = this.state.openAccordians
    oldAccordians[page] = overrideExpanded ?? !oldAccordians[page]
    this.triggerValidationOnInputs(page);
    this.setState({ openAccordians: oldAccordians })
  }

  closeAllAccordians(): void {
    const openAccordians = this.state.openAccordians
    openAccordians[CreatePatientSectionsEnum.patientInfo] = false;
    openAccordians[CreatePatientSectionsEnum.primaryContactInfo] = false;
    openAccordians[CreatePatientSectionsEnum.planDefinitionInfo] = false;
    this.setState({ openAccordians: openAccordians })
  }

  expandNextPage(currentPage: CreatePatientSectionsEnum): void {

    this.toggleAccordian(currentPage, false)
    switch (currentPage) {
      case CreatePatientSectionsEnum.patientInfo:
        this.toggleAccordian(CreatePatientSectionsEnum.primaryContactInfo)
        break
      case CreatePatientSectionsEnum.primaryContactInfo:
        this.toggleAccordian(CreatePatientSectionsEnum.planDefinitionInfo)
        break
    }
  }

  expandPreviousPage(currentPage: CreatePatientSectionsEnum): void {

    this.toggleAccordian(currentPage, false)
    switch (currentPage) {
      case CreatePatientSectionsEnum.primaryContactInfo:
        this.toggleAccordian(CreatePatientSectionsEnum.patientInfo)
        break
      case CreatePatientSectionsEnum.planDefinitionInfo:
        this.toggleAccordian(CreatePatientSectionsEnum.primaryContactInfo)
        break
    }
  }

  render(): JSX.Element {
    this.InitializeServices();
    if (this.state.submitted)
      return (<Redirect push to={"/patients/" + this.state.patient?.cpr + "/careplans/" + this.state.newCareplanId} />)

    if (this.state.loading)
      return (<LoadingBackdropComponent />)

    if (!(this.state.patient && this.state.careplan))
      return (<div>Fandt ikke patienten</div>)

    return (
      <form
        noValidate
        onBlur={() => this.forceUpdate()}  >
        <Grid container sx={{ flexWrap: "inherit" }} columns={12}>
          <Grid item spacing={5} xs={10} minWidth={500}>
            <ErrorBoundary>
              <AccordianWrapper
                expanded={this.state.openAccordians[CreatePatientSectionsEnum.patientInfo]}
                title="Patient"
                toggleExpandedButtonAction={() => this.toggleAccordian(CreatePatientSectionsEnum.patientInfo)}
                continueButtonAction={() => this.expandNextPage(CreatePatientSectionsEnum.patientInfo)}>

                <Typography>
                  <PatientEditCard
                    onValidation={(errors) => {
                      this.setState({ patientError: errors?.length == 0 ? undefined : errors[0].message })
                    }}
                    initialPatient={this.state.patient}
                  />
                </Typography>
              </AccordianWrapper>
            </ErrorBoundary>

            <ErrorBoundary>

              <AccordianWrapper
                expanded={this.state.openAccordians[CreatePatientSectionsEnum.primaryContactInfo]}
                title="Primærkontakt"
                toggleExpandedButtonAction={() => this.toggleAccordian(CreatePatientSectionsEnum.primaryContactInfo)}
                continueButtonAction={() => this.expandNextPage(CreatePatientSectionsEnum.primaryContactInfo)}
                previousButtonAction={() => this.expandPreviousPage(CreatePatientSectionsEnum.primaryContactInfo)}>
                <Typography>
                  <ContactEditCard
                    onValidation={(errors) => this.validateMissingPhoneNumber(errors)}
                    initialContact={this.state.patient.contact} />
                </Typography>
              </AccordianWrapper>
            </ErrorBoundary>

            <ErrorBoundary>
              <AccordianWrapper
                expanded={this.state.openAccordians[CreatePatientSectionsEnum.planDefinitionInfo]}
                title="Patientgruppe"
                toggleExpandedButtonAction={() => this.toggleAccordian(CreatePatientSectionsEnum.planDefinitionInfo)}
                continueButtonAction={() => this.submitPatient()}
                previousButtonAction={() => this.expandPreviousPage(CreatePatientSectionsEnum.planDefinitionInfo)}
                continueButtonContentOverride={"Gem patient"}>
                <Typography>
                  <PlanDefinitionSelect onValidation={(errors) => this.setState({ planDefinitionError: errors?.length == 0 ? undefined : errors[0].message })} SetEditedCareplan={this.SaveCareplan} careplan={this.state.careplan} />
                  <QuestionnaireListSimple careplan={this.state.careplan} />
                </Typography>
              </AccordianWrapper>
            </ErrorBoundary>
          </Grid>
          <Grid paddingLeft={5} xs="auto">
            <div>
              <Card>
                {this.state.patient.cpr ?
                  <>
                    <CardHeader
                      avatar={<PatientAvatar patient={this.state.patient} />}
                      title={
                        <Grid container>
                          <Grid item xs="auto">
                            <Typography>
                              {this.state.patient.firstname} {this.state.patient.lastname} <br />
                              {this.state.patient.cprToString()}
                            </Typography>
                          </Grid>
                        </Grid>
                      } />
                    <Divider /></> : <></>}
                <CardContent>
                  <Stepper orientation="vertical" activeStep={this.getActiveStep()}>
                    <Step key="patient">
                      <StepLabel StepIconComponent={this.GetCheckboxIcon(this.state.patient.cpr)} optional={this.state.patientError} error={this.state.patientError ? true : false}>Patient *</StepLabel>

                    </Step>
                    <Step key="relativecontact">

                      <StepLabel StepIconComponent={this.GetCheckboxIcon(true)} optional={this.state.contactError} error={this.state.contactError ? true : false}>Primærkontakt</StepLabel>

                    </Step>
                    <Step key="plandefinition">
                      <StepLabel StepIconComponent={this.GetCheckboxIcon(this.state.careplan.planDefinitions.find(() => true))} optional={this.state.planDefinitionError} error={this.state.planDefinitionError ? true : false}>Patientgruppe *</StepLabel>
                    </Step>

                  </Stepper>
                </CardContent>
              </Card>
            </div>
          </Grid>

        </Grid>
        {this.state.errorToast ?? <></>}
      </form >


    )
  }



  GetCheckboxIcon(object: unknown): React.ElementType {
    if (!object)
      return RadioButtonUncheckedIcon
    return CheckCircleOutlineIcon
  }


  getActiveStep(): number {
    if (this.state.openAccordians[CreatePatientSectionsEnum.patientInfo])
      return 1
    if (this.state.openAccordians[CreatePatientSectionsEnum.primaryContactInfo])
      return 2
    return 3;
  }





  createNewEmptyCareplan(): PatientCareplan {
    const relativeContact = new Contact();
    const newPatient = new PatientDetail();
    newPatient.address = new Address();

    newPatient.contact = relativeContact

    const newCareplan = new PatientCareplan();
    newCareplan.patient = newPatient;
    return newCareplan;
  }

  async submitPatient(): Promise<void> {
    this.setState({ errorToast: <></> })
    if (!(this.state.careplan && this.state.careplan.patient)) {
      return;
    }

    this.state.careplan.patient = this.state.patient;

    try {
      this.setState({ loading: true })
      await this.validateAcrossData()
      let careplanId: string | undefined;

      if (this.props.editmode) {
        const editedCareplan = await this.careplanService.SetCareplan(this.state.careplan)
        careplanId = editedCareplan.id
      } else {
        const newCareplanId = await this.careplanService.CreateCarePlan(this.state.careplan)
        careplanId = newCareplanId
      }

      this.setState({
        newCareplanId: careplanId,
        submitted: true
      })
    }
    catch (error) {
      if (error instanceof BaseServiceError) {
        this.setState({ errorToast: <ToastError severity="info" error={error} /> })
      } else {
        this.setState(() => { throw error })
      }
    }
    this.setState({ loading: false })
  }

  SaveCareplan(editedCareplan: PatientCareplan): void {
    this.setState({ careplan: editedCareplan })
    this.forceUpdate();
  }

  async componentDidMount(): Promise<void> {
    const cpr = this.props.match.params.cpr;

    try {
      let careplanToEdit: PatientCareplan | undefined = this.createNewEmptyCareplan()
      if (cpr) {
        const careplansForPatient = await this.careplanService.GetPatientCareplans(cpr)
        careplanToEdit = careplansForPatient.find(x => !x.terminationDate);
      }

      this.setState({ loading: false, careplan: careplanToEdit, patient: careplanToEdit ? careplanToEdit.patient : undefined })

    } catch (error) {
      this.setState(() => { throw error })
    }
    new ValidateInputEvent(new ValidateInputEventData(PatientEditCard.sectionName)).dispatchEvent();
  }

  continueButtonStyle: CSSProperties = {
    marginTop: 2
  }

  triggerValidationOnInputs(page: CreatePatientSectionsEnum): void {

    if (page == CreatePatientSectionsEnum.patientInfo) {
      new ValidateInputEvent(new ValidateInputEventData(PatientEditCard.sectionName)).dispatchEvent();
    }

    if (page == CreatePatientSectionsEnum.primaryContactInfo) {
      new ValidateInputEvent(new ValidateInputEventData(PatientEditCard.sectionName)).dispatchEvent();
      new ValidateInputEvent(new ValidateInputEventData(ContactEditCard.sectionName)).dispatchEvent();

    }
    if (page == CreatePatientSectionsEnum.planDefinitionInfo) {
      new ValidateInputEvent(new ValidateInputEventData(PatientEditCard.sectionName)).dispatchEvent();
      new ValidateInputEvent(new ValidateInputEventData(ContactEditCard.sectionName)).dispatchEvent();
      new ValidateInputEvent(new ValidateInputEventData(PlanDefinitionSelect.sectionName)).dispatchEvent();
    }
  }

  async validateAcrossData(): Promise<void> {
    this.setState({ validating: true })
    const errors: string[] = []

    if (this.state.contactError != undefined) {
      errors.push(this.state.contactError)
    }
    if (this.state.patientError != undefined) {
      errors.push(this.state.patientError)
    }
    if (this.state.planDefinitionError != undefined) {
      errors.push(this.state.planDefinitionError)
    }

    this.setState({ validating: false })
    if (errors.length > 0) {
      throw new MissingContactDetailsError(errors);
    }
  }

  validateMissingPhoneNumber(errors: InvalidInputModel[]): void {

    const patientPrimary = this.state.patient?.primaryPhone ?? "";
    const contactPrimary = this.state.patient?.contact?.primaryPhone ?? ""

    if (patientPrimary == "" && contactPrimary == "") {
      errors.push(new InvalidInputModel("telefonnummer", "Et telefonnummer mangler", CriticalLevelEnum.ERROR))
    }

    this.setState({ contactError: errors?.length == 0 ? undefined : errors[0].message })
  }
}
