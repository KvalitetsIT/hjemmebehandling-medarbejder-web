import * as React from 'react';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { Typography } from '@material-ui/core';
import { Alert, Button, Stack } from '@mui/material';
import { PatientDetail } from '../Models/PatientDetail';
import { PatientCareplan } from '../Models/PatientCareplan';
import { InvalidInputModel } from '../../services/Errors/InvalidInputError';

export interface Props {
    patient : PatientDetail;
    careplan : PatientCareplan;
}

export class ValidateCareplanHidden extends Component<Props,{}> {
  static displayName = ValidateCareplanHidden.name;
  static contextType = ApiContext

  render () : JSX.Element{

    const patient = this.props.patient
    
    const allErrors : InvalidInputModel[] = []

    this.ValidateCPR(patient).forEach(x=>allErrors.push(x))
    
    return this.renderValidationResult(allErrors);
  }

ValidateCPR(patient : PatientDetail) : InvalidInputModel[] {
    const erorrs : InvalidInputModel[] = []
    if(!patient.cpr){
        const error = new InvalidInputModel("cpr","cpr er ikke udfyldt")
        erorrs.push(error)
    }
        
    if(patient.cpr?.length != 10){
        const error = new InvalidInputModel("cpr","cpr skal være 10 tegn")
        erorrs.push(error)
    }
    return erorrs;
}

renderValidationResult(errors : InvalidInputModel[]) : JSX.Element{
    return (
        <>
        <Stack>
            {errors.map(error => 
                <Alert severity="error">
                    <Typography>{error.propName +" : "+ error.message} </Typography>
                </Alert>)}

                {errors.length == 0 ? <Alert severity="success">Alt er ok</Alert> : <></>}
        </Stack>
        {this.props.children}
        <Button disabled={errors.length !== 0} type="submit" variant="contained">Gem patient</Button>
        
     
        </>
    )
}

}
