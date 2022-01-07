import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, CardContent, Skeleton, Tooltip } from '@mui/material';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import ApiContext from '../../pages/_context';
import IPersonService from '../../services/interfaces/IPersonService';
import { LoadingButton } from '@mui/lab';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import IValidationService from '../../services/interfaces/IValidationService';
import { CriticalLevelEnum, InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import { Address } from '@kvalitetsit/hjemmebehandling/Models/Address';
import { NotFoundError } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/NotFoundError';
import { ToastError } from '@kvalitetsit/hjemmebehandling/Errorhandling/ToastError'
import { Toast } from '@kvalitetsit/hjemmebehandling/Errorhandling/Toast';

export interface Props {
  initialPatient: PatientDetail
  onValidation?: (error: InvalidInputModel[]) => void
}

export interface State {
  loadingCprButton: boolean;
  loadingPage: boolean
  tempCpr?: string;
  patient: PatientDetail;
  errorArray: InvalidInputModel[];
  toast?: JSX.Element
}

export class PatientEditCard extends Component<Props, State> {
  static contextType = ApiContext;
  static displayName = PatientEditCard.name;
  personService!: IPersonService;
  validationService!: IValidationService;
  collectionHelper!: ICollectionHelper;

  constructor(props: Props) {
    super(props);
    this.state = {
      loadingCprButton: false,
      loadingPage: true,
      tempCpr: props.initialPatient.cpr,
      patient: props.initialPatient,
      errorArray: props.initialPatient.cpr ? [] : [new InvalidInputModel("", "ikke udfyldt")] //Dont validate at start, but dont allow cpr-button to be pressed
    }
    this.modifyPatient = this.modifyPatient.bind(this);

  }

  render(): JSX.Element {
    const contents = this.state.loadingPage ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount(): void {
    this.setState({ loadingPage: false })
  }

  InitializeServices(): void {
    this.personService = this.context.personService;
    this.validationService = this.context.validationService;
    this.collectionHelper = this.context.collectionHelper;
  }

  async getPerson(): Promise<void> {
    try {
      const tempCpr = this.state.tempCpr;
      if (this.state.patient.cpr === null || this.state.patient.cpr === "") {
        return;
      }

      this.setState({
        loadingCprButton: true,
        toast: <></>
      })

      const newPerson = await this.personService.GetPerson(tempCpr!);
      const afterResetPasswordToast = (
        <Toast snackbarTitle="Resultat af fremsøgning" snackbarColor="success">
          {newPerson.givenName} {newPerson.familyName} blev fundet og indsat i formularen
        </Toast>
      )
      this.setState({ toast: afterResetPasswordToast })

      const p = this.state.patient;


      p.firstname = newPerson.givenName;
      p.lastname = newPerson.familyName;

      p.address = new Address();
      p.address.city = newPerson.patientContactDetails?.city ? newPerson.patientContactDetails.city : "";
      p.address.zipCode = newPerson.patientContactDetails?.postalCode ? newPerson.patientContactDetails.postalCode : "";
      p.address.street = newPerson.patientContactDetails?.street ? newPerson.patientContactDetails.street : "";
      p.cpr = tempCpr;
      this.setState({ patient: p });
      this.setState({
        loadingCprButton: false
      })


    } catch (error) {
      if (error instanceof NotFoundError) {
        this.setState({ toast: <ToastError severity="info" error={error} /> })
      } else {
        this.setState(() => { throw error })
      }

    }

    this.setState({
      loadingCprButton: false
    })

    this.triggerOnChangeEvent("cprInput")


  }

  clearPersonFields(): void {
    const p = this.state.patient;

    p.firstname = "";
    p.lastname = "";
    p.address = new Address();
    p.address.city = "";
    p.address.zipCode = "";
    p.address.street = "";

    this.setState({ patient: p });
  }

  modifyPatient(patientModifier: (patient: PatientDetail, newValue: string) => PatientDetail, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    const valueFromInput = input.currentTarget.value;
    const modifiedPatient = patientModifier(this.state.patient, valueFromInput);
    this.setState({ patient: modifiedPatient })
  }

  getFirstError(): string | undefined {
    const errors = this.state.errorArray.filter(x => x.criticalLevel == CriticalLevelEnum.ERROR)
    if (errors.length > 0)
      return this.state.errorArray[0].message;

    return undefined;
  }

  triggerOnChangeEvent(id: string): void {
    const input = document.getElementById(id);
    const event = new Event("input", { bubbles: true });
    if (input)
      input.dispatchEvent(event)
  }

  errorMap: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();
  onValidation(from: number, invalid: InvalidInputModel[]): void {
    console.log("from : " + from)
    const errorMap = this.errorMap;
    errorMap.set(from, invalid);

    const allErrors: InvalidInputModel[] =
      this.collectionHelper.MapValueCollectionToArray<number, InvalidInputModel>(errorMap);

    if (this.state.tempCpr !== this.state.patient.cpr) {
      console.log("Der er indtastet nyt cpr uden at trykke fremsøg (" + this.state.tempCpr + " != " + this.state.patient.cpr + ")")
      allErrors.push(new InvalidInputModel("cpr", "Der er indtastet nyt cpr uden at trykke fremsøg", CriticalLevelEnum.WARNING))
    }


    if (this.props.onValidation) {
      this.props.onValidation(allErrors);
    }
    this.setState({ errorArray: allErrors })
  }


  renderCard(): JSX.Element {
    this.InitializeServices();
    const firstError = this.getFirstError();
    let inputId = 0;
    return (<>
      <ErrorBoundary>
        <Card>
          <CardContent>
            <Stack spacing={3}>
              <Stack direction="row" spacing={3}>
                <TextFieldValidation
                  id="cprInput"
                  disabled={this.state.patient.cpr ? true : false}
                  onValidation={(uid, errors) => this.onValidation(uid, errors)}
                  uniqueId={inputId++}
                  validate={(cpr) => this.validationService.ValidateCPR(cpr)}
                  required={true}
                  label="CPR"
                  value={this.state.tempCpr}
                  onChange={input => this.setState({ tempCpr: input.target.value })} />
                <Stack>
                  <Tooltip title={firstError ?? "Hent fra CPR!"}>
                    <div>
                      <LoadingButton disabled={firstError !== undefined} loading={this.state.loadingCprButton} size="small" variant="contained" onClick={async () => await this.getPerson()}>Fremsøg</LoadingButton>
                    </div>
                  </Tooltip>
                </Stack>

              </Stack>
              <Stack spacing={3} direction="row">
                <TextFieldValidation uniqueId={inputId++} disabled label="Fornavn" value={this.state.patient.firstname} onChange={input => this.modifyPatient(this.setFirstname, input)} variant="outlined" />
                <TextFieldValidation uniqueId={inputId++} disabled label="Efternavn" value={this.state.patient.lastname} onChange={input => this.modifyPatient(this.setLastname, input)} variant="outlined" />
              </Stack>
              <Stack spacing={3} direction="row">
                <TextFieldValidation uniqueId={inputId++} disabled label="Addresse" value={this.state.patient.address?.street} onChange={input => this.modifyPatient(this.setRoad, input)} variant="outlined" />
                <TextFieldValidation disabled
                  onValidation={(uid, errors) => this.onValidation(uid, errors)}
                  uniqueId={inputId++}
                  label="Postnummer"
                  value={this.state.patient.address?.zipCode}
                  onChange={input => this.modifyPatient(this.setZipcode, input)}
                  variant="outlined" />
                <TextFieldValidation uniqueId={inputId++} disabled label="By" value={this.state.patient.address?.city} onChange={input => this.modifyPatient(this.setCiy, input)} variant="outlined" />
              </Stack>
              <Stack spacing={3} direction="row">
                <TextFieldValidation
                  onValidation={(uid, errors) => this.onValidation(uid, errors)}
                  uniqueId={inputId++}
                  validate={(phone) => this.validationService.ValidatePhonenumber(phone)}
                  type="tel"
                  label="Primært telefonnummer"
                  value={this.state.patient.primaryPhone}
                  onChange={input => this.modifyPatient(this.setPrimaryPhonenumber, input)}
                  variant="outlined" />
                <TextFieldValidation
                  onValidation={(uid, errors) => this.onValidation(uid, errors)}
                  uniqueId={inputId++}
                  validate={(phone) => this.validationService.ValidatePhonenumber(phone)}
                  type="tel" label="sekundært telefonnummer" value={this.state.patient.secondaryPhone} onChange={input => this.modifyPatient(this.setSecondaryPhonenumber, input)} variant="outlined" />
              </Stack>
            </Stack>


          </CardContent>
        </Card>
        {this.state.toast ?? <></>}
      </ErrorBoundary>
    </>
    )
  }


  setLastname(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.lastname = newValue;
    return modifiedPatient;
  }
  setFirstname(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.firstname = newValue;
    return modifiedPatient;
  }
  setCpr(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.cpr = newValue;
    return modifiedPatient;
  }

  setRoad(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient!.address!.street = newValue;
    return modifiedPatient;
  }
  setZipcode(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient!.address!.zipCode = newValue;
    return modifiedPatient;
  }

  setCiy(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient!.address!.city = newValue;
    return modifiedPatient;
  }

  setPrimaryPhonenumber(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.primaryPhone = newValue;
    return modifiedPatient;
  }

  setSecondaryPhonenumber(oldPatient: PatientDetail, newValue: string): PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.secondaryPhone = newValue;
    return modifiedPatient;
  }



}
