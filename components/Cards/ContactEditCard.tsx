import { CardContent, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, Skeleton, TextField } from '@mui/material';
import ApiContext from '../../pages/_context';
import IPersonService from '../../services/interfaces/IPersonService';
import { Contact } from '../Models/Contact';

export interface Props {
    initialContact : Contact
}

export interface State {
    loading : boolean;
    contact : Contact
}

export class ContactEditCard extends Component<Props,State> {
  static contextType = ApiContext;
  static displayName = ContactEditCard.name;
  personService!: IPersonService;

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
}

modifyPatient(patientModifier : (contact : Contact, newValue : string) => Contact, input :  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) : void{
  const valueFromInput = input.currentTarget.value;
    const modifiedPatient = patientModifier(this.state.contact,valueFromInput);
    this.setState({contact : modifiedPatient  })
  }

  renderCard() : JSX.Element{
	this.InitializeServices();
    return (
        <Card>
        <CardContent>
          <Stack spacing={3}>

            <Typography variant="inherit">
          Pårørede
      </Typography>
      <Stack spacing={3} direction="row">
              <TextField id="outlined-basic" label="Fornavn" value={this.state.contact.fullname} onChange={input => this.modifyPatient(this.setRelativeContactsName,input) }  variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextField id="outlined-basic" label="Addresse" value={this.state.contact.address.road} onChange={input => this.modifyPatient(this.setRelativeContactsRoad,input) }  variant="outlined" />
              <TextField id="outlined-basic" label="Postnummer" value={this.state.contact.address.zipCode} onChange={input => this.modifyPatient(this.setRelativeContactsZipcode,input) }  variant="outlined" />
              <TextField id="outlined-basic" label="By" value={this.state.contact.address.city} onChange={input => this.modifyPatient(this.setRelativeContactsCity,input) }  variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextField id="outlined-basic" type="tel" label="Telefonnummer" value={this.state.contact.primaryPhone} onChange={input => this.modifyPatient(this.setRelativeContactsPhonenumber,input) } variant="outlined" />
              <TextField id="outlined-basic" type="email" label="Email" value={this.state.contact.emailAddress} onChange={input => this.modifyPatient(this.setRelativeContactsEmail,input) } variant="outlined" />
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
  setRelativeContactsPhonenumber(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.primaryPhone = newValue;
    return modifiedPatient;
  }

  setRelativeContactsEmail(oldPatient : Contact, newValue : string ) : Contact {
    const modifiedPatient = oldPatient;
    modifiedPatient.emailAddress = newValue;
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
