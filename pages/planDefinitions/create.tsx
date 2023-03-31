import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { PlanDefinition, PlanDefinitionStatus } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Button, Card, CardContent, CardHeader, Divider, Grid, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React from "react";
import { Prompt, Redirect } from "react-router-dom";
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
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { ConfirmationButton } from "../../components/Input/ConfirmationButton";

interface Props {
    match: { params: { plandefinitionid?: string } }
}

interface State {
    loading: boolean
    submitted: boolean
    errorToast: JSX.Element
    planDefinition: PlanDefinition
    planDefinitionIsInUse: boolean
    activeAccordian: AccordianRowEnum
    editMode: boolean
    error?: Error
    originalQuestionnaires: Questionnaire[]
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
        this.onAddQuestionnaires = this.onAddQuestionnaires.bind(this);
        this.onRemoveQuestionnaires = this.onRemoveQuestionnaires.bind(this);
        this.onSetThreshold = this.onSetThreshold.bind(this)

        const newPlanDefinition = new PlanDefinition()
        newPlanDefinition.questionnaires = []
        this.state = {
            loading: true,
            submitted: false,
            errorToast: (<></>),
            error: undefined,
            activeAccordian: AccordianRowEnum.generelInfo,
            planDefinition: newPlanDefinition,
            planDefinitionIsInUse: false,
            editMode: props.match.params.plandefinitionid ? true : false,
            originalQuestionnaires: [],
        }
    }

    InitializeServices(): void {
        this.planDefinitionService = this.context.planDefinitionService;
    }

    async componentDidMount(): Promise<void> {
        const providedPlanDefinitionId = this.props.match.params.plandefinitionid
        let planDefinitionToEdit = this.state.planDefinition
        let planDefinitionIsInUse = this.state.planDefinitionIsInUse;

        if (providedPlanDefinitionId) {
            try {
                planDefinitionToEdit = await this.planDefinitionService.GetPlanDefinitionById(providedPlanDefinitionId)
                this.sortThresholds(planDefinitionToEdit)

                planDefinitionIsInUse = await this.planDefinitionService.IsPlanDefinitionInUse(providedPlanDefinitionId);
            } catch (error) {
                this.setState(() => { throw error });
            }
        }
        this.setState({ planDefinition: planDefinitionToEdit, originalQuestionnaires: [...planDefinitionToEdit.questionnaires!], planDefinitionIsInUse: planDefinitionIsInUse, loading: false });
    }

    toggleAccordian(page: AccordianRowEnum): void {
        if (page != this.state.activeAccordian) {
            this.setState({
                activeAccordian: page
            })
        }
    }

    render(): JSX.Element {
        this.InitializeServices();
        return this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
    }

    renderCareplanTab(): JSX.Element {
        if (this.state.submitted) return (<Redirect push to={"/plandefinitions"} />)

        const prompt = (
            <Prompt
                when={true}
                message={() => "Du har ikke gemt eventuelle ændringerne - vil du fortsætte?"}
            />
        )

        const validationScheme =
            yup.object().shape({
                name: yup.string().required("'Navn' er påkrævet"),
                questionnaires: yup.array().min(1, "Minimum et spørgeskema forventes"),
            })


        return (
            <>
                {prompt}
                <Formik
                    initialValues={this.state.planDefinition}
                    onSubmit={(values: FormikValues) => {

                        const modifiedPlanDefinition = this.state.planDefinition
                        modifiedPlanDefinition.name = values.name

                        this.setState({ planDefinition: modifiedPlanDefinition })

                        this.validate(values).then(() => this.submitPlandefinition()).catch(error => {
                            console.log("error:", error)
                            this.setState({ errorToast: <ToastError key={new Date().getTime()} error={error}></ToastError> })
                        })
                    }}

                    validationSchema={validationScheme}
                >
                    {({ errors, validateField, setFieldTouched, submitForm, touched }) => (

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
                                        <PlanDefinitionEdit touched={touched} errors={errors} planDefinition={this.state.planDefinition} />
                                    </AccordianWrapper>

                                    <AccordianWrapper
                                        error={touched.questionnaires && this.state.planDefinition.questionnaires?.length == 0}
                                        expanded={this.state.activeAccordian == AccordianRowEnum.attachQuestionnaire}
                                        title="Tilknyt spørgeskema"
                                        toggleExpandedButtonAction={() => {
                                            validateField("name")
                                            this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)
                                        }}
                                        continueButtonAction={() => {
                                            validateField("questionnaires");
                                            setFieldTouched("questionnaires");
                                            this.toggleAccordian(AccordianRowEnum.thresholds);
                                        }}
                                        previousButtonAction={() => this.toggleAccordian(AccordianRowEnum.generelInfo)}
                                    >
                                        <PlanDefinitionEditQuestionnaire onAdd={this.onAddQuestionnaires} onRemove={this.onRemoveQuestionnaires} onChange={() => setFieldTouched("questionnaires")} planDefinition={this.state.planDefinition} />

                                    </AccordianWrapper>


                                    <AccordianWrapper
                                        expanded={this.state.activeAccordian == AccordianRowEnum.thresholds}
                                        title="Alarmgrænser"
                                        toggleExpandedButtonAction={() => {
                                            validateField("name")
                                            validateField("questionnaires")
                                            setFieldTouched("questionnaires")
                                            this.toggleAccordian(AccordianRowEnum.thresholds)
                                        }}
                                        previousButtonAction={() => this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)}
                                        overrideContinueButton={
                                            <ConfirmationButton
                                                skipDialog={!(this.state.planDefinitionIsInUse && this.planDefinitionContainsNewQuestionnaires())}
                                                color="primary"
                                                variant="contained"
                                                action={() => {
                                                    this.setStatusOnPlanDefinition(BaseModelStatus.ACTIVE);
                                                    return submitForm()
                                                }}
                                                buttonText={'Gem og aktivér'}
                                                contentOfDoActionBtn={'OK'}
                                                contentOfCancelBtn={'Annuller'}
                                            >
                                                <Typography>Husk at angive frekvens på spørgeskemaet hos de patienter, der er tilknyttet patientgruppen.</Typography>
                                            </ConfirmationButton>
                                        }
                                        additionalButtonActions={[
                                            <Button
                                                onClick={() => {
                                                    this.setStatusOnPlanDefinition(BaseModelStatus.DRAFT);
                                                    submitForm()
                                                    //this.submitPlandefinition();
                                                }

                                                }
                                                disabled={(this.state.planDefinition.id != undefined) && (this.state.planDefinition.status != undefined && (this.state.planDefinition.status != BaseModelStatus.DRAFT))}
                                                className='draft-button'
                                                variant="contained"
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
                                        overrideDeactivateButton={
                                            this.state.editMode ?
                                            <ConfirmationButton
                                                color="error"
                                                variant="outlined"
                                                title={"Deaktiver patientgruppe"}
                                                action={async () => {
                                                    this.deactivatePlandefinition();
                                                }}
                                                skipDialog={false}
                                                buttonText={"Deaktiver patientgruppe"}
                                                contentOfCancelBtn={"Fortryd"}
                                                contentOfDoActionBtn={"Deaktiver"}                                                    >
                                                <Typography>Ønsker du at deaktivere patientgruppen {this.state.planDefinition.name}? </Typography>
                                            </ConfirmationButton>
                                            : undefined
                                        }

                                    >

                                        <PlanDefinitionEditThresholds
                                            onError={(error) => {
                                                this.setState({ error: error })
                                            }}
                                            onSetThreshold={this.onSetThreshold}
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
                                                    <StepLabel error={touched.questionnaires && this.state.planDefinition.questionnaires?.length == 0}>Tilknyt spørgeskema</StepLabel>
                                                </Step>
                                                <Step key="setThresholds">
                                                    <StepLabel error={this.state.error != undefined}>Sæt alarmgrænser</StepLabel>
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

        if (this.state.error) {
            missingDetails.push("Fejl i alarmgrænser")
        }

        this.state.planDefinition.questionnaires?.map(questionnaire => {
            if (questionnaire.questions?.find(x => x.type == QuestionTypeEnum.OBSERVATION)) {
                if (questionnaire.thresholds?.flatMap(t => t.thresholdNumbers ?? []).find(t => (t.from == undefined || t.to == undefined) || Number.isNaN(t.from) || Number.isNaN(t.to))) {
                    missingDetails.push("Alarmgrænser skal angives")
                }
            }
        })

        const plandefinitions = await this.planDefinitionService.GetAllPlanDefinitions([BaseModelStatus.DRAFT, BaseModelStatus.ACTIVE])

        const names = plandefinitions.filter(plandefinition => plandefinition.id != this.state.planDefinition.id).map(plandefinition => plandefinition.name);

        if (names.includes(values.name) || names.includes(values.name.trim())) {
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

    onAddQuestionnaires(questionnaires: Questionnaire[]): void {
        const currentQuestionnaires = this.state.planDefinition.questionnaires;
        const newQuestionnaires = questionnaires.filter(q => !currentQuestionnaires?.includes(q));

        const pd = this.state.planDefinition
        pd.questionnaires?.push(...newQuestionnaires)
        this.setState({ planDefinition: pd })
    }

    onRemoveQuestionnaires(questionnaires: Questionnaire[]): void {
        const currentQuestionnaires = this.state.planDefinition.questionnaires;
        const remainingQuestionnaires = currentQuestionnaires?.filter(q => !questionnaires.includes(q));

        const pd = this.state.planDefinition;
        pd.questionnaires = remainingQuestionnaires;
        this.setState({ planDefinition: pd })
    }

    onSetThreshold(newThresholds: ThresholdCollection, question: Question, questionnaire: Questionnaire): void {
        const thresholdCollection = newThresholds

        const modified = this.state.planDefinition;

        const questionnaireIndex = modified.questionnaires!.findIndex(q => q.id == questionnaire.id);
        if (modified.questionnaires && questionnaireIndex != -1) {
            const thresholdIndex = modified.questionnaires![questionnaireIndex!].thresholds!.findIndex(t => t.questionId == question.Id)
            if (thresholdIndex == -1) {
                modified.questionnaires![questionnaireIndex].thresholds?.push(thresholdCollection);
            } else {
                modified.questionnaires![questionnaireIndex].thresholds![thresholdIndex] = thresholdCollection;
            }
        }
        this.setState({ planDefinition: modified })
    }

    planDefinitionContainsNewQuestionnaires(): boolean {
        const originalQuestionnaireIds = this.state.originalQuestionnaires.map(q => q.id);
        const currentQuestionnairesIds = this.state.planDefinition.questionnaires!.map(q => q.id);

        return currentQuestionnairesIds.filter(id => !originalQuestionnaireIds.includes(id)).length != 0;
    }
}