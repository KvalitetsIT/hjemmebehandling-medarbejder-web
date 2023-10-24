import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, CardContent, Skeleton, Typography } from '@mui/material';
import ApiContext, { IApiContext } from '../../pages/_context';
import { IPersonService } from '../../services/interfaces/IPersonService';

import { TextFieldValidation } from '../Input/TextFieldValidation';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { IValidationService } from '../../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { PhonenumberInput } from '../Input/PhonenumberInput';
import { PrimaryContact } from '@kvalitetsit/hjemmebehandling/Models/PrimaryContact';
import { ContactDetails } from '@kvalitetsit/hjemmebehandling/Models/Contact';

export interface Props {
  initialContact?: PrimaryContact
  onValidation?: (error: InvalidInputModel[]) => void
}

export interface State {
  loading: boolean;
  primaryContact: PrimaryContact
}

export class ContactEditCard extends Component<Props, State> {
  static contextType = ApiContext;
  
  static displayName = ContactEditCard.name;
  static sectionName = "ContactEditSection";
  personService!: IPersonService;
  validationService!: IValidationService;
  collectionHelper!: ICollectionHelper;

  constructor(props: Props) {
    super(props);
     
    this.state = { loading: true, primaryContact: props.initialContact ?? new PrimaryContact() }
    this.modifyPatient = this.modifyPatient.bind(this);
  }

  render(): JSX.Element {
    const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount(): void {
    this.setState({ loading: false })
  }

  InitializeServices(): void {
    const api = this.context as IApiContext
    this.personService = api.personService;
    this.validationService = api.validationService;
    this.collectionHelper = api.collectionHelper
  }

  modifyPatient(patientModifier: (contact: PrimaryContact, newValue: string) => PrimaryContact, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    const valueFromInput = input.currentTarget.value;
    const modifiedPatient = patientModifier(this.state.primaryContact, valueFromInput);
    this.setState({ primaryContact: modifiedPatient })
  }

  errorArray: Map<string, InvalidInputModel[]> = new Map<string, InvalidInputModel[]>();

  onValidation(from: string, invalid: InvalidInputModel[]): void {
    this.errorArray.set(from, invalid);

    const allErrors: InvalidInputModel[] =
      this.collectionHelper.MapValueCollectionToArray<string, InvalidInputModel>(this.errorArray)

    if (this.props.onValidation)
      this.props.onValidation(allErrors);
  }

  renderCard(): JSX.Element {
    this.InitializeServices();
    let inputId = 0;
    return (
      <Card>
        <CardContent>
          <Stack spacing={3}>

            <Typography variant="inherit">
              Denne kontaktperson udfyldes, hvis det er en anden end patienten, der er den primære kontakt.
            </Typography>
            <Stack spacing={3} direction="row">
              <TextFieldValidation
                sectionName={ContactEditCard.sectionName}
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                uniqueId={'contact_' + inputId++}
                label="Navn"
                value={this.state.primaryContact.fullname}
                onChange={input => this.modifyPatient(this.setRelativeContactsName, input)}
                variant="outlined" />
              <TextFieldValidation
                sectionName={ContactEditCard.sectionName}
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                uniqueId={'contact_' + inputId++}
                label="Relation"
                value={this.state.primaryContact.affiliation}
                onChange={input => this.modifyPatient(this.setRelativeContactsAffiliation, input)}
                variant="outlined" />

            </Stack>
            <Typography variant='h6' sx={{ paddingTop: 6 }}>Telefonnummer</Typography>
            <Stack spacing={3} direction="row">
              <PhonenumberInput
                sectionName={ContactEditCard.sectionName}
                id="contactPrimaryPhone"
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                uniqueId={'contact_' + inputId++}
                label="Primært telefonnummer" value={this.state.primaryContact.contact?.primaryPhone} onChange={input => this.modifyPatient(this.setRelativeContactsPrimaryPhonenumber, input)}
                variant="outlined" />
              <PhonenumberInput
                sectionName={ContactEditCard.sectionName}
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                uniqueId={'contact_' + inputId++}
                label="Sekundært telefonnummer"
                value={this.state.primaryContact.contact?.secondaryPhone}
                onChange={input => this.modifyPatient(this.setRelativeContactsSecondaryPhonenumber, input)}
                variant="outlined" />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  setRelativeContactsName(oldPatient: PrimaryContact, newValue: string): PrimaryContact {
    const modifiedPatient = oldPatient;
    modifiedPatient.fullname = newValue;
    return modifiedPatient;
  }

  setRelativeContactsAffiliation(oldPatient: PrimaryContact, newValue: string): PrimaryContact {
    const modifiedPatient = oldPatient;
    modifiedPatient.affiliation = newValue;
    return modifiedPatient;
  }

  setRelativeContactsPrimaryPhonenumber(oldPatient: PrimaryContact, newValue: string): PrimaryContact {
    const modifiedPatient = oldPatient;
    if(!modifiedPatient.contact) modifiedPatient.contact = new ContactDetails()
    modifiedPatient.contact.primaryPhone = newValue;
    return modifiedPatient;
  }
  setRelativeContactsSecondaryPhonenumber(oldPatient: PrimaryContact, newValue: string): PrimaryContact {
    const modifiedPatient = oldPatient;
    if(!modifiedPatient.contact) modifiedPatient.contact = new ContactDetails()
    modifiedPatient.contact.secondaryPhone = newValue;
    return modifiedPatient;
  }


}
