import { CardContent, Typography } from '@material-ui/core';
import React, { Component } from 'react';
import Stack from '@mui/material/Stack';
import { Card, Skeleton, Tooltip } from '@mui/material';
import { PatientDetail } from '../Models/PatientDetail';
import ApiContext from '../../pages/_context';
import IPersonService from '../../services/interfaces/IPersonService';
import { LoadingButton } from '@mui/lab';
import { TextFieldValidation } from '../Input/TextFieldValidation';
import IValidationService from '../../services/interfaces/IValidationService';
import { InvalidInputModel } from '../../services/Errors/InvalidInputError';

export interface Props {
    initialPatient : PatientDetail
    onValidation? : (error : InvalidInputModel[]) => void
}

export interface State {
    loadingCprButton : boolean;
    loadingPage : boolean
    patient : PatientDetail;
    errorArray : InvalidInputModel[];
}

export class PatientEditCard extends Component<Props,State> {
  static contextType = ApiContext;
  static displayName = PatientEditCard.name; 
  personService!: IPersonService;
  validationService!: IValidationService;

  constructor(props : Props){
      super(props);
      this.state = {
	      loadingCprButton : false,
        loadingPage : true,
	      patient : props.initialPatient,
        errorArray : props.initialPatient.cpr ? [] : [new InvalidInputModel("","ikke udfyldt")] //Dont validate at start, but dont allow cpr-button to be pressed
      }
      this.modifyPatient = this.modifyPatient.bind(this);
  }

  render () : JSX.Element{
    const contents = this.state.loadingPage ? <Skeleton variant="rectangular" height={200} /> : this.renderCard();
    return contents;
  }

  componentDidMount() : void {
      this.setState({loadingPage:false})
}

InitializeServices() : void{
  this.personService = this.context.personService;
  this.validationService = this.context.validationService;
}

async getPerson() : Promise<void>{
  try{
    if (this.state.patient.cpr === null || this.state.patient.cpr === ""){
	  return;
    }
    
    this.setState({
      loadingCprButton: true
    })
    
    const newPerson = await this.personService.GetPerson(this.state.patient.cpr!);
    
    const p = this.state.patient;
    p.firstname = newPerson.givenName;
    p.lastname = newPerson.familyName;
    
    p.patientContact.address.city = newPerson.patientContactDetails?.city ? newPerson.patientContactDetails.city : "";
    p.patientContact.address.zipCode = newPerson.patientContactDetails?.postalCode ? newPerson.patientContactDetails.postalCode : "";
    p.patientContact.address.road = newPerson.patientContactDetails?.street ? newPerson.patientContactDetails.street : "";
    
    this.setState({patient : p});
    

    this.setState({
      loadingCprButton: false
    })
    
  } catch(error){
	this.setState({
    loadingCprButton: false
    })
    
    if (error instanceof Response){
	   const response = error as Response;
    
      if (response.status == 404){
	     console.log("Ingen borger fundet");
         this.clearPersonFields();
         return;
	  }
    }
    throw error;
  }
  
}

clearPersonFields() : void {
	const p = this.state.patient;
    p.firstname = "";
    p.lastname = "";
    
    p.patientContact.address.city = "";
    p.patientContact.address.zipCode =  "";
    p.patientContact.address.road = "";
    
    this.setState({patient : p});
}

modifyPatient(patientModifier : (patient : PatientDetail, newValue : string) => PatientDetail, input :  React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement> ) : void{
  const valueFromInput = input.currentTarget.value;
    const modifiedPatient = patientModifier(this.state.patient,valueFromInput);
    this.setState({patient : modifiedPatient  })
  }

  errorMap : Map<number,InvalidInputModel[]> = new Map<number,InvalidInputModel[]>();
  onValidation(from : number, invalid : InvalidInputModel[]) : void{
      console.log("from : " + from)  
      const errorMap = this.errorMap;
      errorMap.set(from,invalid);
      
      const allErrors : InvalidInputModel[] = [];
      const iterator = errorMap.entries();
      let next = iterator.next();
      while(next == undefined || !next.done){
        
        next.value[1].forEach(invalid => allErrors.push(invalid))  
        next = iterator.next();
      }

      if(this.props.onValidation){
        this.props.onValidation(allErrors);
      }

      this.setState({errorArray  : allErrors})
  }

  renderCard() : JSX.Element{
	this.InitializeServices();
  let inputId = 0;
    return ( <>
        <Card>
        <CardContent>
          <Stack spacing={3}>
          <Typography variant="inherit">
          Patient
      </Typography>
            <Stack direction="row" spacing={3}>
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  validate={(cpr) => this.validationService.ValidateCPR(cpr) } 
                  required={true} 
                  label="CPR" 
                  value={this.state.patient.cpr} 
                  onChange={input => this.modifyPatient(this.setCpr,input) } />
                  <Stack>
                    <Tooltip title={this.state.errorArray.length > 0 ? this.state.errorArray[0].message : "Hent informationer"}>
                      <div>
                  <LoadingButton disabled={this.state.errorArray.length > 0} loading={this.state.loadingCprButton} size="small" variant="contained" onClick={async ()=>await this.getPerson()}>Fremsøg</LoadingButton>
                    </div>
                  </Tooltip>
                  </Stack>
                
            </Stack>
            <Stack spacing={3} direction="row">
              <TextFieldValidation uniqueId={inputId++}disabled label="Fornavn" value={this.state.patient.firstname} onChange={input => this.modifyPatient(this.setFirstname,input) }  variant="outlined" />
              <TextFieldValidation uniqueId={inputId++} disabled label="Efternavn" value={this.state.patient.lastname} onChange={input => this.modifyPatient(this.setLastname,input) } variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextFieldValidation uniqueId={inputId++} disabled  label="Addresse" value={this.state.patient.patientContact.address.road} onChange={input => this.modifyPatient(this.setRoad,input) }  variant="outlined" />
              <TextFieldValidation disabled  
                    onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                    uniqueId={inputId++}
                    label="Postnummer" 
                    value={this.state.patient.patientContact.address.zipCode} 
                    onChange={input => this.modifyPatient(this.setZipcode,input) }  
                    variant="outlined" />
              <TextFieldValidation uniqueId={inputId++} disabled  label="By" value={this.state.patient.patientContact.address.city} onChange={input => this.modifyPatient(this.setCiy,input) }  variant="outlined" />
            </Stack>
            <Stack spacing={3} direction="row">
              <TextFieldValidation 
                  onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                  uniqueId={inputId++}
                  validate={(phone) => this.validationService.ValidatePhonenumber(phone) } 
                  type="tel" 
                  label="Primært telefonnummer" 
                  value={this.state.patient.patientContact.primaryPhone} 
                  onChange={input => this.modifyPatient(this.setPrimaryPhonenumber,input) } 
                  variant="outlined" />
              <TextFieldValidation 
                    onValidation={(uid, errors)=>this.onValidation(uid,errors)} 
                    uniqueId={inputId++}
                    validate={(phone) => this.validationService.ValidatePhonenumber(phone) }
                    type="tel" label="sekundært telefonnummer" value={this.state.patient.patientContact.secondaryPhone} onChange={input => this.modifyPatient(this.setSecondaryPhonenumber,input) } variant="outlined" />
            </Stack>
         </Stack>

          
        </CardContent>
    </Card>
    </>
    )
  }
  

  setLastname(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.lastname = newValue;
    return modifiedPatient;
  }
  setFirstname(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.firstname = newValue;
    return modifiedPatient;
  }
  setCpr(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.cpr = newValue;
    return modifiedPatient;
  }
  
  setRoad(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.road = newValue;
    return modifiedPatient;
  }
  setZipcode(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.zipCode = newValue;
    return modifiedPatient;
  }
  
  setCiy(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.address.city = newValue;
    return modifiedPatient;
  }
  
  setPrimaryPhonenumber(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.primaryPhone = newValue;
    return modifiedPatient;
  }
  
  setSecondaryPhonenumber(oldPatient : PatientDetail, newValue : string ) : PatientDetail {
    const modifiedPatient = oldPatient;
    modifiedPatient.patientContact.secondaryPhone = newValue;
    return modifiedPatient;
  }
  


}
