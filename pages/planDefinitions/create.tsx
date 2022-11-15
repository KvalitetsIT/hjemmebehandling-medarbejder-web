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

interface Props {
    match: { params: { plandefinitionid?: string } }
}

interface State {
    loading: boolean
    submitted: boolean
    errorToast: JSX.Element
    planDefinition: PlanDefinition
    activeAccordian: AccordianRowEnum
    editMode: boolean
    error?: Error
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
        this.submitPlandefinition = this.submitPlandefinition.bind(this)
        this.deactivatePlandefinition = this.deactivatePlandefinition.bind(this)

        const newPlanDefinition = new PlanDefinition()
        newPlanDefinition.questionnaires = []
        this.state = {
            loading: false,
            submitted: false,
            errorToast: (<></>),
            error: undefined,
            activeAccordian: AccordianRowEnum.generelInfo,
            planDefinition: newPlanDefinition,
            editMode: props.match.params.plandefinitionid ? true : false,
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

    toggleAccordian(page: AccordianRowEnum): void {
        if (page != this.state.activeAccordian) {
          this.setState({
            activeAccordian: page
          })
        }
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
                    onSubmit={(values: FormikValues) => {

                        const modifiedPlanDefinition = this.state.planDefinition
                        modifiedPlanDefinition.name = values.name
                        modifiedPlanDefinition.questionnaires = values.questionnaires

                        this.setState({planDefinition: modifiedPlanDefinition})

                        this.validate(values).then(() => this.submitPlandefinition()).catch(error => {
                            console.log("error:", error)
                            this.setState({ errorToast: <ToastError key={new Date().getTime()} error={error}></ToastError> })
                        })
                    }}
                    
                    validationSchema={validationScheme}
                >
                    {({ errors, validateField, setFieldTouched, submitForm }) => (

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
                                            this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)
                                        }
                                        }>
                                        <PlanDefinitionEdit errors={errors} planDefinition={this.state.planDefinition} />
                                    </AccordianWrapper>

                                    <AccordianWrapper
                                        error={errors.questionnaires != undefined}
                                        expanded={this.state.activeAccordian == AccordianRowEnum.attachQuestionnaire}
                                        title="Tilknyt spørgeskema"
                                        toggleExpandedButtonAction={() => {
                                            validateField("name")
                                            this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)
                                        }}
                                        continueButtonAction={() => {
                                            validateField("questionnaires")
                                            this.toggleAccordian(AccordianRowEnum.thresholds)
                                        }}
                                        previousButtonAction={() => this.toggleAccordian(AccordianRowEnum.generelInfo)}
                                    >
                                        <PlanDefinitionEditQuestionnaire onChange={() => setFieldTouched("questionnaires")} planDefinition={this.state.planDefinition} />

                                    </AccordianWrapper>


                                    <AccordianWrapper
                                        expanded={this.state.activeAccordian == AccordianRowEnum.thresholds}
                                        title="Alarmgrænser"
                                        toggleExpandedButtonAction={() => {
                                            validateField("name")
                                            validateField("questionnaires")
                                            this.toggleAccordian(AccordianRowEnum.thresholds)
                                        }}
                                        previousButtonAction={() => this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)}
                                        continueButtonContentOverride="Gem"
                                        continueButtonAction={() => {

                                            this.setStatusOnPlanDefinition(BaseModelStatus.ACTIVE);
                                            submitForm()
                                        }}
                                        additionalButtonActions={[
                                            <Button
                                                onClick={() => {
                                                    this.setStatusOnPlanDefinition(BaseModelStatus.DRAFT);
                                                    submitForm()
                                                    //this.submitPlandefinition();
                                                }

                                                }

                                                disabled={this.state.planDefinition.status == BaseModelStatus.ACTIVE}
                                                variant="outlined"
                                                title={this.state.planDefinition.status == BaseModelStatus.ACTIVE ? "Du kan ikke gemme en aktiv patientgruppe som kladde" : undefined}
                                                sx={{
                                                    "&.Mui-disabled": {
                                                        pointerEvents: "auto"
                                                    },
                                                    marginLeft: "8px"
                                                }}
                                            >Gem som kladde</Button>
                                        ]}
                                        deactivateButtonText={this.state.editMode ? "Deaktiver patientgruppe" : undefined}
                                        deactivateButtonAction={this.deactivatePlandefinition}
                                        
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
                                            <Stepper orientation="vertical" activeStep={this.getActiveStep()}>
                                                <Step key="plandefinitionGeneral">
                                                    <StepLabel error={errors.name != undefined}>Udfyld patientgruppens navn</StepLabel>
                                                </Step>
                                                <Step key="attachQuestionnaire">
                                                    <StepLabel error={errors.questionnaires != undefined}>Tilknyt spørgeskema</StepLabel>
                                                </Step>
                                                <Step key="setThresholds">
                                                    <StepLabel error={this.state.error!= undefined}>Sætte alarmgrænser</StepLabel>
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

    getActiveStep(): number {
        switch (this.state.activeAccordian) {
            case AccordianRowEnum.generelInfo:
              return 0;
            case AccordianRowEnum.attachQuestionnaire:
              return 1;
            default:
              return 2;
          }
    }


    async validate(values: FormikValues): Promise<void> {

        const missingDetails: string[] = [];


        if (this.state.planDefinition.questionnaires == undefined || this.state.planDefinition.questionnaires.length <= 0) {
            missingDetails.push("Manglende spørgeskema")
        }

        if (this.state.error ) {
            missingDetails.push("Fejl i alarmgrænser")
        }


        const plandefinitions = await this.planDefinitionService.GetAllPlanDefinitions([BaseModelStatus.DRAFT, BaseModelStatus.ACTIVE])

        const names = plandefinitions.filter(plandefinition => plandefinition.id != this.state.planDefinition.id).map(plandefinition => plandefinition.name);

        if (names.includes(values.name)) {
            missingDetails.push("Navnet '" + values.name + "' er allerede i brug")
        }

        if (missingDetails.length > 0) throw new MissingDetailsError(missingDetails);


        return;
    }

    async submitPlandefinition(): Promise<void> {

        console.log("Submitting: ", this.state.planDefinition)

        if (this.state.planDefinition && this.state.editMode)
            await this.planDefinitionService.updatePlanDefinition(this.state.planDefinition);

        if (this.state.planDefinition && !this.state.editMode)
            await this.planDefinitionService.createPlanDefinition(this.state.planDefinition);

        this.setState({
            submitted: true
        })

    }

    deactivatePlandefinition(): void {
        if (this.state.planDefinition && this.state.editMode) {
            this.planDefinitionService.retirePlanDefinition(this.state.planDefinition)
                .then(() => {
                    this.setState({ submitted: true });
                })
                .catch((error) => {
                    this.setState({ errorToast: <ToastError key={new Date().getTime()} error={error}></ToastError> })    
                })
            ;
        }
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