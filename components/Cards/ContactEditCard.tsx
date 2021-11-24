import { CardContent, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, Skeleton } from '@mui/material';
import ApiContext from '../../pages/_context';
import IPersonService from '../../services/interfaces/IPersonService';
import { Contact } from '../Models/Contact';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import { InvalidInputModel } from '../../services/Errors/InvalidInputError';
import IValidationService from '../../services/interfaces/IValidationService';
import { ICollectionHelper } from '../../globalHelpers/interfaces/ICollectionHelper';

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
                  label="Fornavn" 
                  value={this.state.contact.fullname} 
                  onChange={input => this.modifyPatient(this.setRelativeContactsName,input) }  
                  variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  label="Addresse" 
                  value={this.state.contact.address.road} 
                  onChange={input => this.modifyPatient(this.setRelativeContactsRoad,input) }  
                  variant="outlined" />
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  validate={(number) => this.validationService.ValidateZipCode(number)}
                  label="Postnummer"
                  value={this.state.contact.address.zipCode} onChange={input => this.modifyPatient(this.setRelativeContactsZipcode,input) }  
                  variant="outlined" />
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  label="By"
                  value={this.state.contact.address.city} onChange={input => this.modifyPatient(this.setRelativeContactsCity,input) }  
                  variant="outlined" />
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

  setRelativeContactsName(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.fullname = newValue;
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

  setRelativeContactsCity(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.address.city = newValue;
    return modifiedPatient;
  }
  setRelativeContactsRoad(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.address.road = newValue;
    return modifiedPatient;
  }
  setRelativeContactsZipcode(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.address.zipCode = newValue;
    return modifiedPatient;
  }


}
