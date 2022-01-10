import { Box, Button, ButtonGroup, Card, Table, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as React from 'react';
import { LoadingBackdropComponent } from '../../components/Layout/LoadingBackdropComponent';
import { PatientDetail } from '@kvalitetsit/hjemmebehandling/Models/PatientDetail';
import IPatientService from '../../services/interfaces/IPatientService';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { LoadingSmallComponent } from '../../components/Layout/LoadingSmallComponent';
import { Link } from 'react-router-dom';
import ApiContext from '../../pages/_context';
import IsEmptyCard from '@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard'

interface State {
    pageSize: number,
    loadingPage: boolean,
    loadingTable: boolean,
    patients: PatientDetail[]
}

interface Props {
    showActivePatients: boolean;
    pagenumber: number;

}

class PatientsTable extends React.Component<Props, State> {
    static contextType = ApiContext
    patientService!: IPatientService

    constructor(props: Props) {
        super(props);
        this.state = {
            loadingPage: true,
            loadingTable: false,
            patients: [],
            pageSize: 10,
        }
    }

    InitializeServices(): void {
        this.patientService = this.context.patientService;
    }

    async componentDidMount(): Promise<void> {
        this.setState({
            loadingPage: true,
        })
        await this.populatePatients();
        this.setState({
            loadingPage: false,
        })
    }

    async populatePatients(): Promise<void> {
        this.setState({
            loadingTable: true,
        })

        try {

            const patients = await this.patientService.GetPatients(this.props.showActivePatients,!this.props.showActivePatients, this.props.pagenumber, this.state.pageSize);
            this.setState({
                loadingTable: false,
                patients: patients
            })
        } catch (error) {
            this.setState(() => { throw error })
        }

    }

    componentDidUpdate(prevProps: Props): void {
        //When url changes, we should reload patient-data
        if (prevProps.pagenumber != this.props.pagenumber) {
            this.populatePatients()
        }

    }

    render(): JSX.Element {
        this.InitializeServices();
        const contents = this.state.loadingPage ? <LoadingBackdropComponent /> : this.renderPage();
        return contents;
    }

    renderPage(): JSX.Element {
        const hasMorePages: boolean = this.state.patients.length >= this.state.pageSize;
        const currentpage = this.props.pagenumber
        const nextpage: number = currentpage + 1
        const previouspage: number = currentpage - 1
        return (
            <>
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
                            {this.state.loadingTable ? <LoadingSmallComponent /> :

                                this.state.patients.map(patient => {
                                    return (
                                        <TableRow>
                                            <TableCell>
                                                <Button component={Link} to={"/patients/"+patient.cpr}>{patient.cprToString()}</Button> 
                                            </TableCell>
                                            <TableCell>
                                                {patient.firstname} {patient.lastname}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })

                    }
                </Table>
            </TableContainer>  
            </IsEmptyCard>
            <Box paddingTop={5}>
        <ButtonGroup>
                  <Button variant="text" className='button__page-switch' component={Link} to={"./"+previouspage} disabled={previouspage <= 0}><NavigateBeforeIcon/></Button>
                  <Button variant="text" className='button__page-switch' disabled> {currentpage} </Button>
                  <Button variant="text" className='button__page-switch' component={Link} to={"./"+nextpage} disabled={!hasMorePages}><NavigateNextIcon/></Button>
              </ButtonGroup>
        </Box> 
                
            </>

        )
    }
}
export default PatientsTable