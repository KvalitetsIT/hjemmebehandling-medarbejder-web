import { Component } from "react"
import CreatePatient, { PatientAccordianSectionsEnum } from "../../../../components/createpatient"


interface Props {
    editmode: boolean,
    activeAccordian: PatientAccordianSectionsEnum,
    match: { params: { cpr?: string, questionnaireId?: string, careplanId?: string } }
  }

export default class EditPatientInfo extends Component<Props> {
    render() : JSX.Element {
        return <CreatePatient {...this.props}/>
        
    }
}