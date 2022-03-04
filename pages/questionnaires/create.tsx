import { BaseServiceError } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";
import { ToastError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ToastError";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { BaseQuestion, CallToActionQuestion, Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { Redirect } from "react-router-dom";
import { CallToActionCard } from "../../components/Cards/CallToActionCard";
import { QuestionEditCard } from "../../components/Cards/QuestionEditCard";
import { TextFieldValidation } from "../../components/Input/TextFieldValidation";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { IQuestionnaireService } from "../../services/interfaces/IQuestionnaireService";
import ApiContext from "../_context";

interface State {
    loading: boolean
    submitted: boolean
    questionnaire?: Questionnaire
    errorToast: JSX.Element
    editMode: boolean
}

interface Props {
    match: { params: { questionnaireId?: string } }
}
class CreateQuestionnairePage extends React.Component<Props, State> {
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            questionnaire: undefined,
            errorToast: (<></>),
            submitted: false,
            editMode: props.match.params.questionnaireId ? true : false
        }
    }

    render(): JSX.Element {
        this.InitializeServices();
        const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderContent();
        return contents;
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
            question.Id = this.generateQuestionId([]) + "";
            questionnaire.questions = [question];
            if (questionnaireId != undefined)
                questionnaire = await this.questionnaireService.getQuestionnaire(questionnaireId) ?? questionnaire;

            this.setState({ questionnaire: questionnaire })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })
    }

    async submitQuestionnaire(): Promise<void> {
        try {
            this.setState({
                loading: true
            })
            if (this.state.questionnaire && this.state.editMode)
                await this.questionnaireService.updateQuestionnaire(this.state.questionnaire);

            if (this.state.questionnaire && !this.state.editMode)
                await this.questionnaireService.createQuestionnaire(this.state.questionnaire);

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


    renderContent(): JSX.Element {

        if (this.state.submitted)
            return (<Redirect push to={"/questionnaires/"} />)

        if (!this.state.questionnaire)
            return <>Ingen</>

        const questionnaire = this.state.questionnaire;
        const questions = questionnaire.questions?.filter(q => q.type != QuestionTypeEnum.CALLTOACTION);
        const parentQuestions = questionnaire.getParentQuestions();

        //If there are no call-to-action, we add one
        const hasCallToActionQuestion = questionnaire.getCallToActions().find(() => true);
        if (!hasCallToActionQuestion) {
            const newCallToActionQuestion = new CallToActionQuestion();
            newCallToActionQuestion.Id = this.generateQuestionId(questionnaire.questions ?? []) + ""
            newCallToActionQuestion.enableWhens = [];
            questionnaire.questions?.push(newCallToActionQuestion)
        }
        const callToAction = questionnaire.getCallToActions().find(() => true);

        return (
            <>
                <Grid container>
                    <Grid item xs={10}>


                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader subheader={<Typography variant="h6">Spørgeskema</Typography>} />
                                    <Divider />
                                    <CardContent>
                                        <TextFieldValidation
                                            label="Navn"
                                            value={this.state.questionnaire.name}
                                            variant="outlined" uniqueId={1}
                                            onChange={input => this.modifyQuestionnaire(this.setName, input)}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            {parentQuestions?.map((question) => {
                                const childQuestions = questionnaire.getChildQuestions(question.Id)
                                return (
                                    <>
                                        <Grid item xs={12}>
                                            <QuestionEditCard
                                                key={question.Id}
                                                getThreshold={(question) => this.questionnaireService.GetThresholds(questionnaire, question)}
                                                addSubQuestionAction={(q, isParent) => this.addQuestion(q, isParent)}
                                                removeQuestionAction={(questionToRemove) => this.setQuestionnaire(this.questionnaireService.RemoveQuestion(questionnaire, questionToRemove))}
                                                moveItemUp={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, question, -1))}
                                                moveItemDown={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, question, 1))}
                                                forceUpdate={() => this.forceUpdate()}
                                                question={question} />
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
                                                            removeQuestionAction={(questionToRemove) => this.setQuestionnaire(this.questionnaireService.RemoveQuestion(questionnaire, questionToRemove))}
                                                            moveItemUp={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, childQuestion, -1))}
                                                            moveItemDown={() => this.setQuestionnaire(this.questionnaireService.MoveQuestion(questionnaire, childQuestion, 1))}
                                                            parentQuestion={question}
                                                            question={childQuestion}
                                                            forceUpdate={() => this.forceUpdate()}
                                                        />
                                                    </Grid>
                                                </>
                                            )
                                        })}

                                    </>
                                )
                            })}
                            <Grid item xs={12}>
                                <CallToActionCard allQuestions={questions} callToActionQuestion={callToAction!} />
                            </Grid>
                            <Grid item xs={12}>
                                <Card>
                                    <CardHeader subheader={<Typography variant="h6">Gem Spørgeskema</Typography>} />
                                    <Divider />

                                    <CardActions sx={{ display: "flex", justifyContent: "right" }}>
                                        <Button variant="contained" onClick={() => this.submitQuestionnaire()}>Gem</Button>
                                    </CardActions>
                                </Card>

                            </Grid>
                        </Grid>


                    </Grid>

                </Grid>
                {this.state.errorToast ?? <></>}
            </>
        )
    }

    generateQuestionId(existingQuestions: BaseQuestion[]): number {

        let foundNewId = false;
        let newId = 0;
        while (!foundNewId) {
            newId++;
            const idIsAvailable = existingQuestions.findIndex(eq => eq.Id == newId.toString()) == -1
            if (idIsAvailable)
                foundNewId = true;
        }
        return newId
    }

    addQuestion(referenceQuestion: Question | undefined, isParent: boolean, enableWhenQuestionId?: string): void {
        const beforeUpdate = this.state.questionnaire;

        if (!beforeUpdate?.questions)
            return;

        const newQuestion = new Question();
        newQuestion.Id = "" + this.generateQuestionId(beforeUpdate.questions)
        if (referenceQuestion && isParent) {
            const enableWhen = new EnableWhen<boolean>();
            enableWhen.questionId = enableWhenQuestionId ?? referenceQuestion.Id;
            newQuestion.enableWhen = enableWhen;
        }

        const indexOfRefQuestion = beforeUpdate.questions.findIndex(q => q.Id == referenceQuestion?.Id)
        beforeUpdate.questions.splice(indexOfRefQuestion + 1, 0, newQuestion)

        this.setState({ questionnaire: beforeUpdate })
    }

    setQuestionnaire(questionnaire: Questionnaire): void {
        this.setState({ questionnaire: questionnaire })
    }

    modifyQuestionnaire(questionnaireModifier: (questionnaire: Questionnaire, newValue: string) => Questionnaire, input: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        if (!this.state.questionnaire)
            return;

        const valueFromInput = input.currentTarget.value;
        const modifiedQuestionnaire = questionnaireModifier(this.state.questionnaire, valueFromInput);
        this.setState({ questionnaire: modifiedQuestionnaire })
    }

    setName(questionnaire: Questionnaire, newValue: string): Questionnaire {
        const modifiedQuestionnaire = questionnaire;
        modifiedQuestionnaire.name = newValue;
        return modifiedQuestionnaire;
    }



}

export default CreateQuestionnairePage