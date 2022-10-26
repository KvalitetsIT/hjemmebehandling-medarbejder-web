import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { PlanDefinition, PlanDefinitionStatus } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Button, Card, CardContent, CardHeader, Divider, Grid, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";
import { Redirect } from "react-router-dom";
import { AccordianWrapper } from "../../components/Cards/PlanDefinition/AccordianWrapper";
import { PlanDefinitionEdit } from "../../components/Cards/PlanDefinition/PlanDefinitionEdit";
import { PlanDefinitionEditQuestionnaire } from "../../components/Cards/PlanDefinition/PlanDefinitionEditQuestionnaire";
import { PlanDefinitionEditThresholds } from "../../components/Cards/PlanDefinition/PlanDefinitionEditThresholds";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { IPlanDefinitionService } from "../../services/interfaces/IPlanDefinitionService";
import ApiContext from "../_context";
import { Formik, Form, FormikValues } from 'formik';
import { ToastError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ToastError";
import { MissingDetailsError } from "../../components/Errors/MissingDetailsError";
import * as yup from 'yup';



interface State {
    loading: boolean
    submitted: boolean
    errorToast: JSX.Element
    planDefinition: PlanDefinition
    openAccordians: boolean[]
    editMode: boolean
    error?: Error
    activeAccordian: number
    currentValidationScheme: number
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
        this.validate = this.validate.bind(this)
        const accordian: boolean[] = [];
        accordian[AccordianRowEnum.generelInfo] = true;
        accordian[AccordianRowEnum.attachQuestionnaire] = false;
        accordian[AccordianRowEnum.thresholds] = false;
        const newPlanDefinition = new PlanDefinition()
        newPlanDefinition.questionnaires = []
        this.state = {
            loading: false,
            submitted: false,
            errorToast: (<></>),
            error: undefined,
            openAccordians: accordian,
            planDefinition: newPlanDefinition,
            editMode: props.match.params.plandefinitionid ? true : false,
            activeAccordian: 0,
            currentValidationScheme: 0
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
                this.sortThresholds(planDefinitionToEdit)

                this.setState({ planDefinition: planDefinitionToEdit });

            }
        } catch (error) {
            this.setState(() => { throw error });
        }
        this.setState({ loading: false })
    }

    toggleAccordian(page: number): void {
        this.setState({activeAccordian: page })
        this.setState({currentValidationScheme: page})
    }

    closeAllAccordians(): void {
        const openAccordians = this.state.openAccordians
        openAccordians[AccordianRowEnum.generelInfo] = false
        openAccordians[AccordianRowEnum.thresholds] = false
        openAccordians[AccordianRowEnum.attachQuestionnaire] = false
        this.setState({ openAccordians: openAccordians })
    }

    expandNextPage(): void {
       this.setState({currentValidationScheme: this.state.currentValidationScheme + 1})
        this.setState({activeAccordian: this.state.activeAccordian + 1 })
    }

    expandPreviousPage(): void {
        this.setState({currentValidationScheme: this.state.currentValidationScheme -1})
        this.setState({activeAccordian: this.state.activeAccordian - 1 })
    }

    render(): JSX.Element {
        
        return this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
    }


    renderCareplanTab(): JSX.Element {
        this.InitializeServices();

        if (this.state.submitted) return (<Redirect push to={"/plandefinitions"} />)

        
        const validationScheme = 
            yup.object().shape({
                name: yup.string().required("'Navn' er påkrævet"),
                questionnaires: yup.array().min(1, "Minimum et spørgeskema forventes"),
            })
        


        return (
            <>

                <Formik
                    initialValues={this.state.planDefinition}
                    onSubmit={async (values: FormikValues) => {
                        
                        try {
                            await this.validate(values)
                        } catch (error) {
                            // render the toast / snackbar
                            this.setState({ errorToast: <ToastError key={new Date().getTime()} error={error}></ToastError> })
                        }
                    }}
                    validate={
                        (s) => console.log(s)
                    }
                    
                    validationSchema={validationScheme}

                >
                    {({ errors, validateField, setFieldTouched, submitForm}) => (

                        <Form>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Opret patientgruppe</Typography>
                                </Grid>
                                <Grid item xs>
                                    <AccordianWrapper
                                        error={errors.name != undefined}
                                        expanded={this.state.activeAccordian == AccordianRowEnum.generelInfo}
                                        title="Patientgruppe"
                                        toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.generelInfo)}
                                        continueButtonAction={() => {
                                            validateField("name")
                                            this.expandNextPage()
                                        }
                                        }>
                                        <PlanDefinitionEdit errors={errors} planDefinition={this.state.planDefinition} />
                                    </AccordianWrapper>

                                    <AccordianWrapper
                                        error={errors.questionnaires != undefined}
                                        expanded={this.state.activeAccordian == 1}
                                        title="Tilknyt spørgeskema"
                                        toggleExpandedButtonAction={() => {
                                            validateField("name")
                                            this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)
                                        }}
                                        continueButtonAction={() => {
                                            validateField("questionnaires")
                                            this.expandNextPage()
                                        }}
                                        previousButtonAction={() => this.expandPreviousPage()}
                                    >
                                        <PlanDefinitionEditQuestionnaire onChange={() => setFieldTouched("questionnaires")} planDefinition={this.state.planDefinition} />

                                    </AccordianWrapper>


                                    <AccordianWrapper
                                        expanded={this.state.activeAccordian == 2}
                                        title="Alarmgrænser"
                                        toggleExpandedButtonAction={() => {
                                            validateField("name")
                                            validateField("questionnaires")
                                            this.toggleAccordian(AccordianRowEnum.thresholds)
                                        }}
                                        previousButtonAction={() => this.expandPreviousPage()}
                                        continueButtonContentOverride="Gem"
                                        continueButtonAction={() => {                                
                                            submitForm()
                                        }}
                                        additionalButtonActions={[
                                            <Button
                                                onClick={() => {
                                                    this.setStatusOnPlanDefinition(BaseModelStatus.DRAFT);
                                                    //this.submitPlandefinition();
                                                }

                                                }
                                                type="submit"
                                                disabled={this.state.planDefinition.status == BaseModelStatus.ACTIVE}
                                                variant="outlined"
                                                title={this.state.planDefinition.status == BaseModelStatus.ACTIVE ? "Du kan ikke gemme en aktiv patientgruppe som kladde" : undefined}
                                                sx={{
                                                    "&.Mui-disabled": {
                                                        pointerEvents: "auto"
                                                    }
                                                }}
                                            >Gem som kladde</Button>
                                        ]}
                                    >

                                        <PlanDefinitionEditThresholds
                                            onError={(error) => {
                                                this.setState({ error: error })
                                            }}
                                            planDefinition={this.state.planDefinition} />
                                    </AccordianWrapper>


                                </Grid>
                                <Grid item xs={2}>
                                    <Card>

                                        <CardHeader
                                            title={<Typography>Oprettelse af patientgruppe</Typography>} />

                                        <Divider />
                                        <CardContent>
                                            <Stepper orientation="vertical" activeStep={this.state.activeAccordian}>
                                                <Step key="plandefinitionGeneral">
                                                    <StepLabel error={errors.name != undefined}>Udfyld patientgruppens navn</StepLabel>
                                                </Step>
                                                <Step key="attachQuestionnaire">
                                                    <StepLabel error={errors.questionnaires != undefined}>Tilknyt spørgeskema</StepLabel>
                                                </Step>
                                                <Step key="setThresholds">
                                                    <StepLabel>Sætte alarmgrænser</StepLabel>
                                                </Step>

                                            </Stepper>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid >
                        </Form>
                    )}

                </Formik>
                {this.state.errorToast}
            </>
        )
    }



    async validate(values: FormikValues): Promise<void> {

        const missingDetails: string[] = [];

        if (this.state.planDefinition.questionnaires == undefined || this.state.planDefinition.questionnaires.length <= 0) {
            missingDetails.push("Manglende spørgeskema")
        }

        const plandefinitions = await this.planDefinitionService.GetAllPlanDefinitions([BaseModelStatus.ACTIVE])

        if (!plandefinitions.every(planDefinition => { planDefinition.name != values.name })) {
            missingDetails.push("Navnet '" + values.name + "' er allerede i brug")
        }

        if (missingDetails.length > 0) throw new MissingDetailsError(missingDetails);

        return;
    }

    async submitPlandefinition(): Promise<void> {
        if (this.state.planDefinition && this.state.editMode)
            await this.planDefinitionService.updatePlanDefinition(this.state.planDefinition);

        if (this.state.planDefinition && !this.state.editMode)
            await this.planDefinitionService.createPlanDefinition(this.state.planDefinition);

        this.setState({
            submitted: true
        })
    }

    setStatusOnPlanDefinition(newStatus: PlanDefinitionStatus | BaseModelStatus): void {
        const planDefinition = this.state.planDefinition

        planDefinition.status = newStatus;
        this.setState({ planDefinition: planDefinition })
    }

    sortThresholds(planDefinition: PlanDefinition): PlanDefinition {
        planDefinition.questionnaires?.forEach(x => {
            x.thresholds?.forEach(y => y.thresholdNumbers?.sort((a, b) => b.from! - a.from!))
        })
        return planDefinition;
    }
}