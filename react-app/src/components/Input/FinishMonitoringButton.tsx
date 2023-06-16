import * as React from 'react';
import { Button, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@mui/material';
import { ICareplanService } from '../../services/interfaces/ICareplanService';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import { PatientCareplan } from '@kvalitetsit/hjemmebehandling/Models/PatientCareplan';
import { ConfirmationButton } from './ConfirmationButton';
import ApiContext, { IApiContext } from '../../pages/_context';


interface State {
    toast?: JSX.Element
}
interface Props {
    careplan: PatientCareplan
}

export class FinishMonitoringButton extends React.Component<React.PropsWithChildren<Props>, State>{
    careplanService!: ICareplanService;
    static contextType = ApiContext;
    private readonly api: IApiContext;

    constructor(props: Props) {
        super(props)

        this.api = this.context as IApiContext
    }

InitialiseServices(): void {
    this.careplanService = this.api.careplanService
}
reloadPage(): void {
    window.location.replace("/");
}

createNonCloseableDialog(title: string | JSX.Element, subtitle: string | JSX.Element, message: string | JSX.Element): JSX.Element {
    return (
        <Dialog fullWidth open={true}>
            <DialogTitle id="alert-dialog-title">
                <Typography variant="subtitle1">{title}</Typography>
                <Typography variant="caption">{subtitle}</Typography>

            </DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Typography variant="caption">{message}</Typography>
                </DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button autoFocus onClick={this.reloadPage}>Gå til Opgaveliste</Button>
            </DialogActions>
        </Dialog>
    )
}
    async finishCareplan(careplan: PatientCareplan): Promise < void> {
    try {
        await this.careplanService.TerminateCareplan(careplan)
            const patientName = this.props.careplan.patient?.firstname + " " + this.props.careplan.patient?.lastname
            const patientCpr = this.props.careplan.patient?.cprToString()
            const afterResetPasswordToast = this.createNonCloseableDialog(
            <><CheckCircleOutlinedIcon color='success' /> Monitoreringsplanen er afsluttet</>,
            "",
            <>
                <Typography>Følgende monitoreringsplan blev afsluttet</Typography>
                <Chip icon={<PersonOutlineOutlinedIcon />} label={<Typography padding={2}>{patientName} ({patientCpr})</Typography>} />
            </>
        )
            this.setState({ toast: afterResetPasswordToast })
    } catch(error: unknown) {
        this.setState(() => {
            throw error
        })
    }
}

render(): JSX.Element {
    this.InitialiseServices()
    return (
        <>
            <ConfirmationButton fullWidth
                color="error"
                className='darkColor border'
                buttonText="Afslut monitoreringsplan"
                skipDialog={false}
                title="Afslut monitoreringsplan"
                contentOfDoActionBtn={'Afslut monitoreringsplan'}
                contentOfCancelBtn={'Fortryd'}
                action={async () => await this.finishCareplan(this.props.careplan)}>
                Er du sikker på, at du ønsker at afslutte patientens monitoreringsplan?
            </ConfirmationButton>
            {this.state?.toast ?? <></>}
        </>
    )
}

}