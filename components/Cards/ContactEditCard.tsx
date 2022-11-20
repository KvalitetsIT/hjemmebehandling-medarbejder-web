import { CardContent, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, Skeleton } from '@mui/material';
import ApiContext from '../../pages/_context';
import { IPersonService } from '../../services/interfaces/IPersonService';
import { Contact } from '@kvalitetsit/hjemmebehandling/Models/Contact';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import { IValidationService } from '../../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';
import { PhonenumberInput } from '../Input/PhonenumberInput';

export interface Props {
  initialContact?: Contact
  onValidation?: (error: InvalidInputModel[]) => void
}

export interface State {
  loading: boolean;
  contact: Contact
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
    this.state = { loading: true, contact: props.initialContact ?? new Contact() }
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
    this.personService = this.context.personService;
    this.validationService = this.context.validationService;
    this.collectionHelper = this.context.collectionHelper
  }

  modifyPatient(patientModifier: (contact: Contact, newValue: string) => Contact, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
    const valueFromInput = input.currentTarget.value;
    const modifiedPatient = patientModifier(this.state.contact, valueFromInput);
    this.setState({ contact: modifiedPatient })
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
                value={this.state.contact.fullname}
                onChange={input => this.modifyPatient(this.setRelativeContactsName, input)}
                variant="outlined" />
              <TextFieldValidation
                sectionName={ContactEditCard.sectionName}
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                uniqueId={'contact_' + inputId++}
                label="Relation"
                value={this.state.contact.affiliation}
                onChange={input => this.modifyPatient(this.setRelativeContactsAffiliation, input)}
                variant="outlined" />

            </Stack>
            <Stack spacing={3} direction="row">
              <PhonenumberInput
                sectionName={ContactEditCard.sectionName}
                id="contactPrimaryPhone"
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                uniqueId={'contact_' + inputId++}
                label="Primært telefonnummer" value={this.state.contact.primaryPhone} onChange={input => this.modifyPatient(this.setRelativeContactsPrimaryPhonenumber, input)}
                variant="outlined" />
              <PhonenumberInput
                sectionName={ContactEditCard.sectionName}
                onValidation={(uid, errors) => this.onValidation(uid, errors)}
                uniqueId={'contact_' + inputId++}
                label="Sekundært telefonnummer"
                value={this.state.contact.secondaryPhone}
                onChange={input => this.modifyPatient(this.setRelativeContactsSecondaryPhonenumber, input)}
                variant="outlined" />
            </Stack>


          </Stack>


        </CardContent>
      </Card>
    )
  }

  setRelativeContactsName(oldPatient: Contact, newValue: string): Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.fullname = newValue;
    return modifiedPatient;
  }

  setRelativeContactsAffiliation(oldPatient: Contact, newValue: string): Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.affiliation = newValue;
    return modifiedPatient;
  }

  setRelativeContactsPrimaryPhonenumber(oldPatient: Contact, newValue: string): Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.primaryPhone = newValue;
    return modifiedPatient;
  }
  setRelativeContactsSecondaryPhonenumber(oldPatient: Contact, newValue: string): Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.secondaryPhone = newValue;
    return modifiedPatient;
  }


}
