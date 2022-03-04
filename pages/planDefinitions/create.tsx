import { BaseServiceError } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";
import { ToastError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ToastError";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";
import { Redirect } from "react-router-dom";
import { AccordianWrapper } from "../../components/Cards/PlanDefinition/AccordianWrapper";
import { PlanDefinitionEdit } from "../../components/Cards/PlanDefinition/PlanDefinitionEdit";
import { PlanDefinitionEditQuestionnaire } from "../../components/Cards/PlanDefinition/PlanDefinitionEditQuestionnaire";
import { PlanDefinitionEditThresholds } from "../../components/Cards/PlanDefinition/PlanDefinitionEditThresholds";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { IPlanDefinitionService } from "../../services/interfaces/IPlanDefinitionService";
import ApiContext from "../_context";

interface State {
    loading: boolean
    submitted: boolean
    errorToast: JSX.Element

    planDefinition: PlanDefinition
    openAccordians: boolean[]
    editMode: boolean
}

interface Props {
    match: { params: { plandefinitionid?: string } }
}

enum AccordianRowEnum {
    generelInfo,
    attachQuestionnaire,
    thresholds
}

export default class CreatePlandefinition extends React.Component<Props, State> {
    static contextType = ApiContext
    planDefinitionService!: IPlanDefinitionService

    constructor(props: Props) {
        super(props)

        const accordian: boolean[] = [];
        accordian[AccordianRowEnum.generelInfo] = true;
        accordian[AccordianRowEnum.attachQuestionnaire] = false;
        accordian[AccordianRowEnum.thresholds] = false;
        const newPlanDefinition = new PlanDefinition()
        newPlanDefinition.questionnaires = []
        this.state = {
            loading: false,
            submitted: false,
            errorToast: <></>,

            openAccordians: accordian,
            planDefinition: newPlanDefinition,
            editMode: props.match.params.plandefinitionid ? true : false
        }

    }

    InitializeServices(): void {
        this.planDefinitionService = this.context.planDefinitionService;
    }

    async componentDidMount(): Promise<void> {
        this.setState({ loading: true })
        try {
            const providedPlanDefinitionId = this.props.match.params.plandefinitionid
            if (providedPlanDefinitionId) {
                const planDefinitionToEdit = await this.planDefinitionService.GetPlanDefinitionById(providedPlanDefinitionId)
                this.setState({ planDefinition: planDefinitionToEdit });
            }
        } catch (error) {
            this.setState(() => { throw error });
        }
        this.setState({ loading: false })
    }

    toggleAccordian(page: AccordianRowEnum, overrideExpanded?: boolean): void {
        this.closeAllAccordians();
        const oldAccordians = this.state.openAccordians
        oldAccordians[page] = overrideExpanded ?? !oldAccordians[page]
        this.setState({ openAccordians: oldAccordians })
    }

    closeAllAccordians(): void {
        const openAccordians = this.state.openAccordians
        openAccordians[AccordianRowEnum.generelInfo] = false
        openAccordians[AccordianRowEnum.thresholds] = false
        openAccordians[AccordianRowEnum.attachQuestionnaire] = false
        this.setState({ openAccordians: openAccordians })
    }

    expandNextPage(currentPage: AccordianRowEnum): void {

        this.toggleAccordian(currentPage, false)
        switch (currentPage) {
            case AccordianRowEnum.generelInfo:
                this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)
                break
            case AccordianRowEnum.attachQuestionnaire:
                this.toggleAccordian(AccordianRowEnum.thresholds)
                break
        }
    }

    expandPreviousPage(currentPage: AccordianRowEnum): void {

        this.toggleAccordian(currentPage, false)
        switch (currentPage) {
            case AccordianRowEnum.attachQuestionnaire:
                this.toggleAccordian(AccordianRowEnum.generelInfo)
                break
            case AccordianRowEnum.thresholds:
                this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)
                break
        }
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
        return contents;
    }

    renderCareplanTab(): JSX.Element {
        this.InitializeServices();

        if (this.state.submitted)
            return (<Redirect push to={"/plandefinitions"} />)

        return (
            <>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h6">Opret patientgruppe</Typography>
                    </Grid>
                    <Grid item xs>
                        <AccordianWrapper
                            expanded={this.state.openAccordians[AccordianRowEnum.generelInfo]}
                            title="Patientgruppe"
                            toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.generelInfo)}
                            continueButtonAction={() => this.expandNextPage(AccordianRowEnum.generelInfo)}
                        >

                            <PlanDefinitionEdit planDefinition={this.state.planDefinition} />

                        </AccordianWrapper>

                        <AccordianWrapper
                            expanded={this.state.openAccordians[AccordianRowEnum.attachQuestionnaire]}
                            title="Tilknyt spørgeskema"
                            toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)}
                            continueButtonAction={() => this.expandNextPage(AccordianRowEnum.attachQuestionnaire)}
                            previousButtonAction={() => this.expandPreviousPage(AccordianRowEnum.attachQuestionnaire)}
                        >

                            <PlanDefinitionEditQuestionnaire planDefinition={this.state.planDefinition} />

                        </AccordianWrapper>

                        <AccordianWrapper
                            expanded={this.state.openAccordians[AccordianRowEnum.thresholds]}
                            title="Alarmgrænser"
                            toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.thresholds)}
                            previousButtonAction={() => this.expandPreviousPage(AccordianRowEnum.thresholds)}
                            continueButtonContentOverride="Gem"
                            continueButtonAction={async () => {
                                this.setStatusOnPlanDefinition("ACTIVE");
                                await this.submitQuestionnaire();
                            }}
                        >

                            <PlanDefinitionEditThresholds planDefinition={this.state.planDefinition} />


                        </AccordianWrapper>
                    </Grid>
                    <Grid item xs={2}>
                        <Card>

                            <CardHeader
                                title={<Typography>Oprettelse af patientgruppe</Typography>} />

                            <Divider />
                            <CardContent>
                                <Stepper orientation="vertical" activeStep={this.getActiveStep()}>
                                    <Step key="plandefinitionGeneral">
                                        <StepLabel>Udfyld patientgruppens navn</StepLabel>
                                    </Step>
                                    <Step key="attachQuestionnaire">

                                        <StepLabel>Tilknyt spørgeskema</StepLabel>

                                    </Step>
                                    <Step key="setThresholds">
                                        <StepLabel>Sætte alarmgrænser</StepLabel>
                                    </Step>

                                </Stepper>
                            </CardContent>
                            <CardActions>
                                <Button fullWidth onClick={async () => { this.setStatusOnPlanDefinition("DRAFT"); await this.submitQuestionnaire(); }} variant="outlined">Gem patientgruppen som kladde</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid >
                {this.state.errorToast ?? <></>}
            </>
        )
    }

    async submitQuestionnaire(): Promise<void> {
        try {
            this.setState({
                loading: true
            })

            if (this.state.planDefinition && this.state.editMode)
                await this.planDefinitionService.updatePlanDefinition(this.state.planDefinition);

            if (this.state.planDefinition && !this.state.editMode)
                await this.planDefinitionService.createPlanDefinition(this.state.planDefinition);

            this.setState({
                submitted: true
            })
        } catch (error) {
            if (error instanceof BaseServiceError) {
                this.setState({ errorToast: <ToastError severity="info" error={error} /> })
            } else {
                this.setState(() => { throw error })
            }
        }

        this.setState({
            loading: false
        })
    }

    setStatusOnPlanDefinition(newStatus: string): void {
        const planDefinition = this.state.planDefinition
        planDefinition.status = newStatus;
        this.setState({ planDefinition: planDefinition })
    }
    getActiveStep(): number {
        const openAccordians = this.state.openAccordians;
        if (openAccordians[AccordianRowEnum.generelInfo] == true)
            return 0
        if (openAccordians[AccordianRowEnum.attachQuestionnaire] == true)
            return 1
        if (openAccordians[AccordianRowEnum.thresholds] == true)
            return 2

        return 0
    }
}