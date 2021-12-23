import { CardContent, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, Checkbox, Skeleton } from '@mui/material';
import ApiContext from '../../pages/_context';
import IPersonService from '../../services/interfaces/IPersonService';
import { Contact } from '@kvalitetsit/hjemmebehandling/Models/Contact';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import IValidationService from '../../services/interfaces/IValidationService';
import { ICollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/interfaces/ICollectionHelper';

export interface Props {
    initialContact : Contact
    onValidation? : (error : InvalidInputModel[]) => void
}

export interface State {
    loading : boolean;
    contact : Contact
}

export class ContactEditCard extends Component<Props,State> {
  static contextType = ApiContext;
  static displayName = ContactEditCard.name;
  personService!: IPersonService;
  validationService!: IValidationService;
  collectionHelper!: ICollectionHelper;

  constructor(props : Props){
      super(props);
      this.state = {loading : true, contact : props.initialContact}
      this.modifyPatient = this.modifyPatient.bind(this);
  }

  render () : JSX.Element{
    const contents = this.state.loading ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount() : void {
      this.setState({loading:false})
}

InitializeServices() : void{
  this.personService = this.context.personService;
  this.validationService = this.context.validationService;
  this.collectionHelper = this.context.collectionHelper
}

modifyPatient(patientModifier : (contact : Contact, newValue : string) => Contact, input :  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) : void{
  const valueFromInput = input.currentTarget.value;
    const modifiedPatient = patientModifier(this.state.contact,valueFromInput);
    this.setState({contact : modifiedPatient  })
  }

  errorArray : Map<number,InvalidInputModel[]> = new Map<number,InvalidInputModel[]>();
  onValidation(from : number, invalid : InvalidInputModel[]) : void{
    console.log("from : " + from)  
    this.errorArray.set(from,invalid);
      
      const allErrors : InvalidInputModel[] = 
          this.collectionHelper.MapValueCollectionToArray<number,InvalidInputModel>(this.errorArray)

      if(this.props.onValidation)
        this.props.onValidation(allErrors);

        console.log(this.errorArray)
  }

  renderCard() : JSX.Element{
	this.InitializeServices();
  let inputId = 0;
    return (
        <Card>
        <CardContent>
          <Stack spacing={3}>

            <Typography variant="inherit">
          Pårørede
      </Typography>
      <Stack spacing={3} direction="row">
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  label="Navn" 
                  value={this.state.contact.fullname} 
                  onChange={input => this.modifyPatient(this.setRelativeContactsName,input) }  
                  variant="outlined" />
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  label="Tilhørsforhold" 
                  value={this.state.contact.affiliation} 
                  onChange={input => this.modifyPatient(this.setRelativeContactsAffiliation,input) }  
                  variant="outlined" />

              <span>
                Primær
                <Checkbox checked={this.state.contact.primaryContact} onChange={input => this.modifyPatient(this.setRelativeContactsPrimaryContact,input) } title="Primær kontakt"/>
              </span>
                  
            </Stack>
            <Stack spacing={3} direction="row">
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  type="tel"      
                  label="Primær telefonnummer" value={this.state.contact.primaryPhone} onChange={input => this.modifyPatient(this.setRelativeContactsPrimaryPhonenumber,input) } 
                  validate={(input)=>this.validationService.ValidatePhonenumber(input)}
                  variant="outlined" />
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  type="tel"
                  label="Sekundær telefonnummer" 
                  validate={(input)=>this.validationService.ValidatePhonenumber(input)}
                  value={this.state.contact.secondaryPhone} 
                  onChange={input => this.modifyPatient(this.setRelativeContactsSecondaryPhonenumber,input) } 
                  variant="outlined" />
            </Stack>
            
            
          </Stack>

          
        </CardContent>
    </Card>
    )
  }
  setRelativeContactsPrimaryContact(oldPatient: Contact, newValue: string): Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.primaryContact = !modifiedPatient.primaryContact
    console.log(newValue)
    return modifiedPatient;
  }

  setRelativeContactsName(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.fullname = newValue;
    return modifiedPatient;
  }

  setRelativeContactsAffiliation(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.affiliation = newValue;
    return modifiedPatient;
  }

  setRelativeContactsPrimaryPhonenumber(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.primaryPhone = newValue;
    return modifiedPatient;
  }
  setRelativeContactsSecondaryPhonenumber(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.secondaryPhone = newValue;
    return modifiedPatient;
  }


}
