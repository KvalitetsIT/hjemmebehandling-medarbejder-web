import { BaseServiceError } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";
import { ToastError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ToastError";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { CallToActionQuestion, Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Table, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React from "react";
import { Prompt, Redirect } from "react-router-dom";
import { CallToActionCard } from "../../components/Cards/CallToActionCard";
import { QuestionEditCard } from "../../components/Cards/QuestionEditCard";
import { TextFieldValidation } from "../../components/Input/TextFieldValidation";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { IQuestionnaireService } from "../../services/interfaces/IQuestionnaireService";
import ApiContext from "../_context";
import { v4 as uuid } from 'uuid';
import { CriticalLevelEnum, InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { ValidateInputEvent, ValidateInputEventData } from "@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent";
import { MissingDetailsError } from "../../components/Errors/MissingDetailsError";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { ConfirmationButton } from "../../components/Input/ConfirmationButton";


interface Props {
    match: { params: { questionnaireId?: string } }
}

interface State {
    loading: boolean
    submitted: boolean
    errorToast: JSX.Element
    questionnaire?: Questionnaire
    questionnaireIsInUse?: boolean
    editMode: boolean
    errors: Map<string, InvalidInputModel[]>
    changes: string[] // The id's of the questions that havent been saved yet
}

class CreateQuestionnairePage extends React.Component<Props, State> {
    static sectionName = "questionnaire";
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService
    validateEvent: ValidateInputEvent = new ValidateInputEvent(new ValidateInputEventData(CreateQuestionnairePage.sectionName)); //triggers validations of all fields

    constructor(props: Props) {
        super(props);

        this.onValidation = this.onValidation.bind(this);
        this.deactivateQuestionnaire = this.deactivateQuestionnaire.bind(this);

        this.state = {
            loading: true,
            questionnaire: undefined,
            questionnaireIsInUse: undefined,
            errorToast: (<></>),
            submitted: false,
            editMode: props.match.params.questionnaireId ? true : false,
            errors: new Map(),
            changes: []
        }
    }

    render(): JSX.Element {
        this.InitializeServices();
        return this.state.loading ? <LoadingBackdropComponent /> : this.renderContent();
    }

    InitializeServices(): void {
        this.questionnaireService = this.context.questionnaireService;
    }

    async componentDidMount(): Promise<void> {
        
        await this.populateCareplans()
    }

    async populateCareplans(): Promise<void> {
        try {
            const questionnaireId = this.props.match.params.questionnaireId;
            let questionnaire = new Questionnaire();
            const question = new Question();
            question.Id = this.generateQuestionId();
            questionnaire.questions = [question];
            let questionnaireIsInUse = false;

            if (questionnaireId != undefined) {
                questionnaire = await this.questionnaireService.getQuestionnaire(questionnaireId) ?? questionnaire;
                questionnaireIsInUse = await this.questionnaireService.IsQuestionnaireInUse(questionnaireId);
            } else {
                this.addChange(question.Id);
            }
            this.setState({ questionnaire: questionnaire, questionnaireIsInUse: questionnaireIsInUse })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })
    }

     questionnaireContainsMeasurementsWhichisNew(): boolean {
        if (this.state.editMode) {
            const questions = this.state.questionnaire?.questions?.filter(q => this.state.changes.includes(q.Id!)).filter(q => q.type == QuestionTypeEnum.OBSERVATION)
            
            return questions != undefined && questions.length > 0
        }
        return false;
    }



    async submitQuestionnaire(newStatus: QuestionnaireStatus | BaseModelStatus): Promise<void> {
        this.setState({
            loading: true
        })

        await this.validateEvent.dispatchEvent()

        try {
            const valid = this.state.errors.size == 0

            if (valid) {
                const questionnaire = this.state.questionnaire!;
            
                const manualValidationError1 = questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type == QuestionTypeEnum.BOOLEAN)
                    .map(q => questionnaire.thresholds!.find(t => t.questionId == q.Id))
                    .flatMap(tc => tc?.thresholdOptions ?? [])
                    .find(to => to.category == undefined)
                const manualValidationError2 = questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type == QuestionTypeEnum.OBSERVATION)
                    .find((q: Question) => q.measurementType == undefined);
                
                if (manualValidationError1 || manualValidationError2) {
                    throw new MissingDetailsError([]);
                }
                
                questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type == QuestionTypeEnum.BOOLEAN)
                    .forEach((q: Question) => q.measurementType = undefined);

                questionnaire.status = newStatus;

                if (this.state.questionnaire && this.state.editMode) await this.questionnaireService.updateQuestionnaire(questionnaire);

                if (this.state.questionnaire && !this.state.editMode) await this.questionnaireService.createQuestionnaire(questionnaire);

                this.setState({
                    submitted: true
                })
            } else {
                throw new MissingDetailsError([]);
            }
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

    async validateQuestionnaireName(name: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (name.length <= 0) errors.push(new InvalidInputModel("Navn", "Navn er ikke udfyldt", CriticalLevelEnum.ERROR))
        return errors
    }


    onValidation(uniqueId: string, error: InvalidInputModel[]): void {
        const errors = this.state.errors
        if (error.length == 0) {
            errors.delete(uniqueId)
        } else {
            errors.set(uniqueId, error)
        }
        this.setState({ errors: errors })
    }

    renderContent(): JSX.Element {

        const prompt = (
            <Prompt
                when={true}
                message={() => "Du har ikke gemt eventuelle ændringerne - vil du fortsætte?"}
            />
        )

        if (this.state.submitted)
            return (<Redirect push to={"/questionnaires"} />)

        if (!this.state.questionnaire)
            return <>Ingen</>

        const questionnaire = this.state.questionnaire;
        const questions: Question[] = [];
        questionnaire.getParentQuestions().map(question => {
            questions.push(question);
            questions.push(...questionnaire.getChildQuestions(question.Id));
        });
        //const questions = questionnaire.questions?.filter(q => q.type != QuestionTypeEnum.CALLTOACTION);
        const parentQuestions = questionnaire.getParentQuestions();

        //If there are no call-to-actions, we add one
        const hasCallToActionQuestion = questionnaire.getCallToActions().find(() => true);
        if (hasCallToActionQuestion == undefined) {
            const newCallToActionQuestion = new CallToActionQuestion();
            newCallToActionQuestion.Id = this.generateQuestionId()
            newCallToActionQuestion.enableWhens = [];
            questionnaire.questions?.push(newCallToActionQuestion)
        }

        const callToAction = questionnaire.getCallToActions().find(() => true);
        return (
            <>
                {prompt}
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader subheader={<Typography variant="h6">Spørgeskema</Typography>} />
                            <Divider />
                            <CardContent>
                                <TextFieldValidation
                                    validate={(value) => this.validateQuestionnaireName(value)}
                                    onValidation={this.onValidation}
                                    sectionName={CreateQuestionnairePage.sectionName}
                                    label="Navn"
                                    value={this.state.questionnaire.name}
                                    size="medium"
                                    variant="outlined"
                                    uniqueId={this.state.questionnaire.id}
                                    /*disabled={this.state.questionnaire.status == BaseModelStatus.ACTIVE}*/
                                    onChange={input => this.modifyQuestionnaire(this.setName, input)}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    {parentQuestions?.map(question => {
                        const childQuestions = questionnaire.getChildQuestions(question.Id)
                        return (
                            <>
                                <Grid item xs={12}>
                                    {this.state.editMode ? 
                                        <Grid item xs={12}>
                                            <Alert severity="warning"><strong>OBS!</strong> Du kan rediger <i>spørgsmålstype</i>, <i>målingstype</i> eller <i>triagering</i>, ved at oprette spørgsmålet på ny og slette det oprindelige. </Alert>
                                        </Grid>
                                    :null}
                                    <QuestionEditCard
                                        key={question.Id}
                                        getThreshold={(question) => this.questionnaireService.GetThresholds(questionnaire, question)}
                                        addSubQuestionAction={(q, isParent) => this.addQuestion(q, isParent)}
                                        removeQuestionAction={(questionToRemove) => this.removeQuestion(questionToRemove, questionnaire)}
                                        moveItemUp={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, question, -1))}
                                        moveItemDown={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, question, 1))}
                                        forceUpdate={() => this.forceUpdate()}
                                        question={question}
                                        onValidation={this.onValidation}
                                        sectionName={CreateQuestionnairePage.sectionName}
                                        disabled={!this.state.changes.includes(question.Id!)}
                                        deletable={parentQuestions.length<=1}
                                    />
                                </Grid>
                                {childQuestions?.map(childQuestion => {
                                    return (
                                        <> 
                                            <Grid item xs={1} alignSelf="center" textAlign="center">
                                            </Grid>
                                            <Grid item xs={11}>                                                
                                                <QuestionEditCard
                                                    key={childQuestion.Id}
                                                    getThreshold={(question) => this.questionnaireService.GetThresholds(questionnaire, question)}
                                                    addSubQuestionAction={(q) => this.addQuestion(q, true, question.Id)}
                                                    removeQuestionAction={(questionToRemove) => this.removeQuestion(questionToRemove, questionnaire)}
                                                    moveItemUp={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, childQuestion, -1))}
                                                    moveItemDown={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, childQuestion, 1))}
                                                    parentQuestion={question}
                                                    question={childQuestion}
                                                    forceUpdate={() => this.forceUpdate()}
                                                    onValidation={this.onValidation}
                                                    sectionName={CreateQuestionnairePage.sectionName}
                                                    disabled={!this.state.changes.includes(childQuestion.Id!)}
                                                />
                                            </Grid>
                                        </>
                                    )
                                })}
                            </>
                        )
                    })}
                    <Grid item xs={12}>
                        <CallToActionCard allQuestions={questions} callToActionQuestion={callToAction!} sectionName={CreateQuestionnairePage.sectionName} onValidation={this.onValidation} />
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography>Hvis du ønsker at arbejde videre på spørgeskemaet, skal du gemme som kladde og kan fortsætte oprettelsen på et senere tidspunkt. Er du derimod færdig med spørgeskemaet, skal du blot trykke gem.</Typography>
                            </CardContent>
                            <Divider />
                            <TableContainer component={Card}>
                                <Table sx={{ width:'100%' }} aria-label="simple table">
                                    <TableRow>
                                        <TableCell align="left">
                                            {this.state.editMode ? 
                                            <CardActions sx={{ display: "flex", justifyContent: "left" }}>
                                                <Button color="error" variant="outlined" onClick={this.deactivateQuestionnaire}>Inaktiver spørgeskema</Button>
                                            </CardActions>
                                            :
                                            null
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <CardActions sx={{ display: "flex", justifyContent: "right" }}>
                                                <Button className='draft-button' 
                                                    variant="contained"
                                                     disabled={(this.state.questionnaire.id != undefined) && (this.state.questionnaire.status != undefined && (this.state.questionnaire.status != BaseModelStatus.DRAFT)) }
                                                    onClick={() => {
                                                        const newStatus = Questionnaire.stringToQuestionnaireStatus("DRAFT");
                                                        this.submitQuestionnaire(newStatus).then(() => this.validateEvent.dispatchEvent())
                                                    }}
                                                >Gem som kladde</Button>
                                                <ConfirmationButton
                                                    color="primary"
                                                    variant="contained"
                                                    contentOfDoActionBtn="Forstået"
                                                    contentOfCancelBtn="Fortryd"
                                                    action={async () => {
                                                        const newStatus = Questionnaire.stringToQuestionnaireStatus("ACTIVE");
                                                        this.submitQuestionnaire(newStatus).then(() => this.validateEvent.dispatchEvent()).catch(() => console.log("SUBMIT.. men med fejl"))
                                                    }}
                                                    skipDialog={!(this.state.questionnaireIsInUse && this.questionnaireContainsMeasurementsWhichisNew())}
                                                    title={'OBS - Husk at opdatere alarmgrænser for måling i patientgrupper, hvor spørgeskemaer er tilføjet.'}
                                                    buttonText={'Aktivér'}
                                                >
                                                    <Typography>Alarmgrænser skal defineres for den/de nye målinger, der er tilføjet, ellers vil der ikke blive triageret på rød, gul, grøn.</Typography>
                                                </ConfirmationButton>
                                            </CardActions>
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Grid>
                </Grid>
                {this.state.errorToast ?? <></>}
            </>
        )
    }

    removeQuestion(questionToRemove: Question, questionnaire: Questionnaire): void {
        this.setQuestionnaire(this.questionnaireService.RemoveQuestion(questionnaire, questionToRemove))
        this.removeChange(questionToRemove.Id!)
    }


    generateQuestionId(): string {

        const newID = uuid();

        return newID;
    }

    addQuestion(referenceQuestion: Question | undefined, isParent: boolean, enableWhenQuestionId?: string): void {
        const beforeUpdate = this.state.questionnaire;

        if (!beforeUpdate?.questions)
            return;
        const newQuestion = new Question();
        newQuestion.Id = this.generateQuestionId()
        if (referenceQuestion && isParent) {
            const enableWhen = new EnableWhen<boolean>();
            enableWhen.questionId = enableWhenQuestionId ?? referenceQuestion.Id;
            newQuestion.enableWhen = enableWhen;
        }

        const indexOfRefQuestion = beforeUpdate.questions.findIndex(q => q.Id == referenceQuestion?.Id)
        beforeUpdate.questions.splice(indexOfRefQuestion + 1, 0, newQuestion)
        this.setState({ questionnaire: beforeUpdate })
        this.addChange(newQuestion.Id!)
    }

    addChange(id: string): void {
        this.setState(previousState => ({
            changes: [...previousState.changes, id]
        }));
    }
    removeChange(id: string): void {
        this.setState(previousState => ({
            changes: previousState.changes.filter(x => x !== id)
        }));
    }

    setQuestionnaire(questionnaire: Questionnaire): void {
        this.setState({ questionnaire: questionnaire })
    }

    modifyQuestionnaire(questionnaireModifier: (questionnaire: Questionnaire, newValue: string) => Questionnaire, input: undefined | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, overrideInput?: string): void {
        if (!this.state.questionnaire)
            return;
        let valueFromInput = input?.currentTarget?.value ?? ""
        if (overrideInput)
            valueFromInput = overrideInput
        const modifiedQuestionnaire = questionnaireModifier(this.state.questionnaire, valueFromInput);
        this.setState({ questionnaire: modifiedQuestionnaire })
    }

    setName(questionnaire: Questionnaire, newValue: string): Questionnaire {
        const modifiedQuestionnaire = questionnaire;
        modifiedQuestionnaire.name = newValue;
        return modifiedQuestionnaire;
    }

    setStatus(questionnaire: Questionnaire, newValue: string): Questionnaire {
        const modifiedQuestionnaire = questionnaire;
        modifiedQuestionnaire.status = Questionnaire.stringToQuestionnaireStatus(newValue)
        return modifiedQuestionnaire;
    }

    deactivateQuestionnaire(): void {
        if (this.state.questionnaire && this.state.editMode) {
            this.questionnaireService.retireQuestionnaire(this.state.questionnaire)
                .then(() => {
                    this.setState({ submitted: true });
                })
                .catch((error) => {
                    this.setState({ errorToast: <ToastError key={new Date().getTime()} error={error}></ToastError> })
                })
            ;
        }
    }
}

export default CreateQuestionnairePage