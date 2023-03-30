import React, { Component, CSSProperties } from 'react';
import { CardContent, Card, Grid, Step, StepLabel, Stepper, Typography, CardHeader, Divider } from '@mui/material';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import { Contact } from '@kvalitetsit/hjemmebehandling/Models/Contact';
import ApiContext from '../pages/_context';
import { IPatientService } from '../services/interfaces/IPatientService';
import { LoadingBackdropComponent } from './Layout/LoadingBackdropComponent';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { QuestionnaireListSimple } from './Cards/QuestionnaireListSimple';
import { PatientEditCard } from './Cards/PatientEditCard';
import { Address } from '@kvalitetsit/hjemmebehandling/Models/Address';
import { ContactEditCard } from './Cards/ContactEditCard';
import { PlanDefinitionSelect } from './Input/PlanDefinitionSelect';
import { ICareplanService } from '../services/interfaces/ICareplanService';
import { Prompt, Redirect } from 'react-router-dom';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import { BaseServiceError } from '@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError'
import { ToastError } from '@kvalitetsit/hjemmebehandling/Errorhandling/ToastError'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { PatientAvatar } from './Avatars/PatientAvatar';
import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { MissingContactDetailsError } from './Errors/MissingContactDetailsError';
import { AccordianWrapper } from './Cards/PlanDefinition/AccordianWrapper';
import { ConfirmationButton } from './Input/ConfirmationButton';

/**
 * 
 */
export interface Props {
  editmode: boolean,
  activeAccordian: PatientAccordianSectionsEnum,
  match: { params: { cpr?: string, questionnaireId?: string, careplanId?: string } }
}

export enum PatientAccordianSectionsEnum {
  patientInfo,
  primaryContactInfo,
  planDefinitionInfo
}

/**
 * 
 */
export interface State {
  activeAccordian: PatientAccordianSectionsEnum;
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
  dialog: JSX.Element | undefined
}



export default class CreatePatient extends Component<Props, State> {
  static contextType = ApiContext;
  static displayName = CreatePatient.name;
  careplanService!: ICareplanService;
  patientService!: IPatientService;

  constructor(props: Props) {

    super(props);

    this.SaveCareplan = this.SaveCareplan.bind(this);

    this.state = {
      loading: true,
      submitted: false,
      errorToast: (<></>),
      activeAccordian: props.activeAccordian ?? PatientAccordianSectionsEnum.patientInfo,
      validating: false,
      dialog: undefined
    }

  }
  InitializeServices(): void {
    this.careplanService = this.context.careplanService;
    this.patientService = this.context.patientService;
  }

  toggleAccordian(page: PatientAccordianSectionsEnum): void {
    if (page != this.state.activeAccordian) {
      this.triggerValidationOnInputs(page);
      this.setState({
        activeAccordian: page
      })
    }
  }


  isFrequencySet(): boolean {
    return this.state.careplan?.questionnaires != undefined && this.state.careplan?.questionnaires?.length > 0 && this.state.careplan?.questionnaires.every(questionnaire => {
      return questionnaire?.frequency && questionnaire?.frequency.days?.length > 0
    });

  }

  render(): JSX.Element {
    this.InitializeServices();
    if (this.state.submitted)
      return (<Redirect push to={"/patients/" + this.state.patient?.cpr + "/careplans/" + this.state.newCareplanId} />)

    if (this.state.loading)
      return (<LoadingBackdropComponent />)

    if (!(this.state.patient && this.state.careplan))
      return (<div>Fandt ikke patienten</div>)

    const prompt = (
      <Prompt
        when={true} // <- Kunne sættes til true afhængig af om ændringer er blevet lavet 
        message={() => "Evt. ændringer er endnu ikke gemt - Ønsker du at fortsætte?"}
      />
    )

    return (
      <>
        {prompt}
        <form noValidate>
          <Grid container sx={{ flexWrap: "inherit" }} columns={12}>
            <Grid item spacing={5} xs={10} minWidth={500}>
              <ErrorBoundary>
                <AccordianWrapper
                  key={PatientAccordianSectionsEnum.patientInfo + "_" + this.state.patient.cpr}
                  expanded={this.state.activeAccordian == PatientAccordianSectionsEnum.patientInfo}
                  title="Patient"
                  toggleExpandedButtonAction={() => this.toggleAccordian(PatientAccordianSectionsEnum.patientInfo)}
                  continueButtonAction={() => this.toggleAccordian(PatientAccordianSectionsEnum.primaryContactInfo)}>

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
                  key={PatientAccordianSectionsEnum.primaryContactInfo + "_" + this.state.patient.cpr}
                  expanded={this.state.activeAccordian == PatientAccordianSectionsEnum.primaryContactInfo}
                  title="Primær kontakt"
                  toggleExpandedButtonAction={() => this.toggleAccordian(PatientAccordianSectionsEnum.primaryContactInfo)}
                  continueButtonAction={() => this.toggleAccordian(PatientAccordianSectionsEnum.planDefinitionInfo)}
                  previousButtonAction={() => this.toggleAccordian(PatientAccordianSectionsEnum.patientInfo)}>
                  <Typography>
                    <ContactEditCard
                      onValidation={(errors) => this.validateMissingPhoneNumber(errors)}
                      initialContact={this.state.patient.contact} />
                  </Typography>
                </AccordianWrapper>
              </ErrorBoundary>
              <ErrorBoundary>
                <AccordianWrapper
                  key={PatientAccordianSectionsEnum.planDefinitionInfo + "_" + this.state.patient.cpr}
                  expanded={this.state.activeAccordian == PatientAccordianSectionsEnum.planDefinitionInfo}
                  title="Patientgruppe"
                  toggleExpandedButtonAction={() => this.toggleAccordian(PatientAccordianSectionsEnum.planDefinitionInfo)}
                  overrideContinueButton={
                    <ConfirmationButton
                      skipDialog={this.isFrequencySet()}
                      color="primary"
                      variant="contained"
                      action={() => this.submitPatient()}
                      buttonText={'Gem patient'}
                      contentOfDoActionBtn={'Gem patient'}
                      contentOfCancelBtn={'Angiv frekvens'}
                      cancelBtnIsPrimary={true}
                      cancelBtnIsLast={true}
                      title="Du har ikke angivet frekvens"
                      disabled={this.state.patientError != undefined || this.state.contactError != undefined || this.state.planDefinitionError != undefined}
                    >
                      <Typography>Vær opmærksom på følgende: <br />
                        - Der vil ikke fremkomme blå alarmer, hvis borgeren mangler at indsende besvarelse.<br />
                        - Borgeren kan ikke se, hvilke dage, der skal indsendes besvarelse.</Typography>
                    </ConfirmationButton>
                  }
                  previousButtonAction={() => this.toggleAccordian(PatientAccordianSectionsEnum.primaryContactInfo)}
                >
                  <Typography>
                    <PlanDefinitionSelect
                      onValidation={(errors) => this.setState({ planDefinitionError: errors?.length == 0 ? undefined : errors[0].message })}
                      SetEditedCareplan={this.SaveCareplan}
                      careplan={this.state.careplan} />
                    <QuestionnaireListSimple careplan={this.state.careplan} />
                  </Typography>
                </AccordianWrapper>
              </ErrorBoundary>
            </Grid>
            <Grid paddingLeft={5} xs>
              <div>
                <Card>
                  {this.state.patient.cpr ?
                    <>
                      <CardHeader
                        avatar={<PatientAvatar patient={this.state.patient} />}
                        title={
                          <Grid container>
                            <Grid item xs={12}>
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
                        <StepLabel
                          optional={this.state.patientError}
                          error={this.state.patientError ? true : false}>Patient *</StepLabel>
                      </Step>
                      <Step key="relativecontact">
                        <StepLabel
                          optional={this.state.contactError}
                          error={this.state.contactError ? true : false}>Primær kontakt</StepLabel>
                      </Step>
                      <Step key="plandefinition">
                        <StepLabel
                          optional={this.state.planDefinitionError}
                          error={this.state.planDefinitionError ? true : false}>Patientgruppe *</StepLabel>
                      </Step>
                    </Stepper>

                  </CardContent>
                </Card>
              </div>
            </Grid>

          </Grid>
          {this.state.errorToast ?? <></>}
        </form >
      </>



    )
  }

  GetCheckboxIcon(object: unknown): React.ElementType {
    if (!object)
      return RadioButtonUncheckedIcon
    return CheckCircleOutlineIcon
  }


  getActiveStep(): number {
    switch (this.state.activeAccordian) {
      case PatientAccordianSectionsEnum.patientInfo:
        return 1;
      case PatientAccordianSectionsEnum.primaryContactInfo:
        return 2;
      default:
        return 3;
    }
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
    console.log("SaveCareplan", editedCareplan)
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

  triggerValidationOnInputs(page: PatientAccordianSectionsEnum): void {

    if (page == PatientAccordianSectionsEnum.patientInfo) {
      new ValidateInputEvent(new ValidateInputEventData(PatientEditCard.sectionName)).dispatchEvent();
    }

    if (page == PatientAccordianSectionsEnum.primaryContactInfo) {
      new ValidateInputEvent(new ValidateInputEventData(PatientEditCard.sectionName)).dispatchEvent();
      new ValidateInputEvent(new ValidateInputEventData(ContactEditCard.sectionName)).dispatchEvent();

    }
    if (page == PatientAccordianSectionsEnum.planDefinitionInfo) {
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
      errors.push(new InvalidInputModel("telefonnummer", "Der mangler at blive angivet et primært telefonnummer enten ved patient eller primær kontakt", CriticalLevelEnum.ERROR))
    }

    this.setState({ contactError: errors?.length == 0 ? undefined : errors[0].message })
  }
}
