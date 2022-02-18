import { BaseServiceError } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";
import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { ToastError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ToastError";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { CallToActionQuestion, Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";
import { Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { Redirect } from "react-router-dom";
import { CallToActionCard } from "../../../components/Cards/CallToActionCard";
import { QuestionEditCard } from "../../../components/Cards/QuestionEditCard";
import { TextFieldValidation } from "../../../components/Input/TextFieldValidation";
import { LoadingBackdropComponent } from "../../../components/Layout/LoadingBackdropComponent";
import { IQuestionnaireService } from "../../../services/interfaces/IQuestionnaireService";
import ApiContext from "../../_context";

interface State {
    loading: boolean
    submitted: boolean
    questionnaire?: Questionnaire
    errorToast: JSX.Element
}

interface Props {
    match: { params: { questionnaireId: string } }
}
class EditQuestionnairePage extends React.Component<Props, State> {
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            questionnaire: undefined,
            errorToast: (<></>),
            submitted: false
        }
        this.removeQuestion = this.removeQuestion.bind(this)
        this.getThresholds = this.getThresholds.bind(this)

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
            const questionnaire = await this.questionnaireService.getQuestionnaire(this.props.match.params.questionnaireId);
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
            console.log("submitted questionnaire:")
            console.log(this.state.questionnaire)
            if (this.state.questionnaire)
                await this.questionnaireService.updateQuestionnaire(this.state.questionnaire);
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
        const parentQuestions = questions?.filter(q => !(q as Question).enableWhen);

        //If there are no call-to-action, we add one
        const hasCallToActionQuestion = questionnaire.questions?.find(q => q.type == QuestionTypeEnum.CALLTOACTION)
        if (!hasCallToActionQuestion) {
            const newCallToActionQuestion = new CallToActionQuestion();
            newCallToActionQuestion.enableWhens = [];
            questionnaire.questions?.push(newCallToActionQuestion)
        }
        const callToAction = questionnaire.questions?.find(q => q.type == QuestionTypeEnum.CALLTOACTION)
        console.log("callToAction")
        console.log(callToAction)
        return (
            <IsEmptyCard object={questionnaire.questions} jsxWhenEmpty="Ingen spørgsmål på spørgeskema">
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
                            {parentQuestions?.map((question, index) => {
                                const childQuestion = questions?.map(q => q as Question).filter(q => q.enableWhen?.questionId == question.Id)
                                return (
                                    <>
                                        <Grid item xs={12}>
                                            <QuestionEditCard
                                                key={question.Id}
                                                getThreshold={this.getThresholds}
                                                addSubQuestionAction={(q, isParent) => this.addQuestion(q, isParent)}
                                                removeQuestionAction={this.removeQuestion}
                                                moveItemUp={() => this.MoveItemFromIndex(index, -1)}
                                                moveItemDown={() => this.MoveItemFromIndex(index, 1)}
                                                forceUpdate={() => this.forceUpdate()}
                                                question={question} />
                                        </Grid>
                                        {childQuestion?.map(childQuestion => {
                                            return (
                                                <>
                                                    <Grid item xs={1} alignSelf="center" textAlign="center">

                                                    </Grid>
                                                    <Grid item xs={11}>
                                                        <QuestionEditCard
                                                            key={childQuestion.Id}
                                                            getThreshold={this.getThresholds}
                                                            removeQuestionAction={this.removeQuestion}
                                                            moveItemUp={() => { console.log("") }}
                                                            moveItemDown={() => { console.log("") }}
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
            </IsEmptyCard>
        )
    }

    tempQuestionId = 0;
    addQuestion(referenceQuestion: Question | undefined, isParent: boolean): void {
        const beforeUpdate = this.state.questionnaire;

        if (!beforeUpdate?.questions)
            return;

        const newQuestion = new Question();
        newQuestion.Id = "" + this.tempQuestionId++;
        if (referenceQuestion && isParent) {
            const enableWhen = new EnableWhen<boolean>();
            enableWhen.questionId = referenceQuestion.Id;
            newQuestion.enableWhen = enableWhen;
        }

        const indexOfRefQuestion = beforeUpdate.questions.findIndex(q => q.Id == referenceQuestion?.Id)
        beforeUpdate.questions.splice(indexOfRefQuestion + 1, 0, newQuestion)

        this.setState({ questionnaire: beforeUpdate })
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


    getThresholds(question: Question): ThresholdCollection {
        const questionnaire = this.state.questionnaire
        let thresholdCollection = questionnaire?.thresholds?.find(x => x.questionId == question.Id);

        if (!thresholdCollection) {
            thresholdCollection = new ThresholdCollection();
            thresholdCollection.questionId = question.Id!;
            questionnaire?.thresholds?.push(thresholdCollection);

        }

        const trueOption = new ThresholdOption();
        trueOption.option = true.toString();
        trueOption.category = CategoryEnum.GREEN
        const falseOption = new ThresholdOption();
        falseOption.option = false.toString();
        falseOption.category = CategoryEnum.GREEN

        thresholdCollection.thresholdOptions = [trueOption, falseOption];

        return thresholdCollection;
    }


    removeQuestion(questionToRemove: Question): void {
        const questionnaire = this.state.questionnaire;

        if (!questionnaire?.questions)
            return;

        const indexOfElementToRemove = questionnaire.questions.findIndex(q => q.Id == questionToRemove.Id)
        if (indexOfElementToRemove > -1)
            questionnaire.questions.splice(indexOfElementToRemove, 1);

        this.setState({ questionnaire: questionnaire })
    }

    MoveItemFromIndex(index: number, step: number): void {
        this.setState({ loading: true })
        const toPosition = index + step;
        const fromPosition = index;

        const beforeQuestionnaire = this.state.questionnaire;
        if (!beforeQuestionnaire)
            return;

        const oldQuestions = beforeQuestionnaire.questions;
        if (!oldQuestions)
            return;

        const fromPositionItem = oldQuestions[fromPosition];
        const toPositionItem = oldQuestions[toPosition];
        if (!fromPositionItem || !toPositionItem)
            return;


        const newQuestions = oldQuestions;
        newQuestions[fromPosition] = toPositionItem;
        newQuestions[toPosition] = fromPositionItem;

        const afterQuestionnaire = beforeQuestionnaire;
        afterQuestionnaire.questions = newQuestions;

        this.setState({ questionnaire: afterQuestionnaire, loading: false })

    }



}
export default EditQuestionnairePage;