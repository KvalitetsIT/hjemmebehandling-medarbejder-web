import { Box, Button, Card, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as React from 'react';
import { LoadingBackdropComponent } from '../Layout/LoadingBackdropComponent';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import { IPatientService } from '../../services/interfaces/IPatientService';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';
import { Link } from 'react-router-dom';
import ApiContext from '../../pages/_context';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard'
import { PageSelectorButtons } from '../Input/PageSelectorButtons';

interface State {
    pageSize: number,
    loadingPage: boolean,
    loadingTable: boolean,
    patients: PatientDetail[]
    pagenumber: number;
}

interface Props {
    showActivePatients: boolean;

}

class PatientsTable extends React.Component<Props, State> {
    static contextType = ApiContext
    patientService!: IPatientService

    constructor(props: Props) {
        super(props);
        this.state = {
            loadingPage: false,
            loadingTable: true,
            patients: [],
            pageSize: 8,
            pagenumber: 1
        }
    }

    InitializeServices(): void {
        this.patientService = this.context.patientService;
    }

    async getData(pageNumber: number): Promise<PatientDetail[]> {
        this.setState({
            loadingTable: true,
        })

        let patients: PatientDetail[] = [];
        try {
            patients = await this.patientService.GetPatients(this.props.showActivePatients, !this.props.showActivePatients, pageNumber, this.state.pageSize);

        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({
            loadingTable: false,
        })
        return patients;
    }

    async populatePatients(pageNumber: number, patients: PatientDetail[]): Promise<void> {
        this.setState({
            loadingTable: false,
            pagenumber: pageNumber,
            patients: patients,
        })
    }

    /*  componentDidUpdate(prevProps: Props): void {
         //When url changes, we should reload patient-data
         if (prevProps.pagenumber != this.props.pagenumber) {
             this.populatePatients(g)
         }
 
     } */

    render(): JSX.Element {
        this.InitializeServices();
        const contents = this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
        return contents;
    }

    renderPage(): JSX.Element {
        return (
            <>
                {this.state.loadingTable ? <LoadingSmallComponent /> :
                    <IsEmptyCard list={this.state.patients} jsxWhenEmpty="Ingen patienter fundet">
                        <TableContainer component={Card}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>
                                            CPR
                                        </TableCell>
                                        <TableCell>
                                            Navn
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                {this.state.patients.map(patient => {
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                {patient.cprToString()}
                                            </TableCell>
                                            <TableCell>
                                            <Button component={Link} to={"/patients/" + patient.cpr}>{patient.firstname} {patient.lastname}</Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </Table>
                        </TableContainer>
                    </IsEmptyCard>
                }

                <Box paddingTop={5}>
                    <PageSelectorButtons
                        currentPageNumber={this.state.pagenumber}
                        setPage={async (pageNumber, data) => await this.populatePatients(pageNumber, data as PatientDetail[])}
                        getData={async (pageNumber) => (await this.getData(pageNumber)) as PatientDetail[]}
                    />

                </Box>

            </>

        )
    }
}
export default PatientsTable