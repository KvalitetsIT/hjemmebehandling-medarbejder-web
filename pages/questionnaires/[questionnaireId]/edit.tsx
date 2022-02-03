import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { Question } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Button, Card, CardContent, CardHeader, Divider, Grid, Typography } from "@mui/material";
import React from "react";
import { QuestionEditCard } from "../../../components/Cards/QuestionEditCard";
import { TextFieldValidation } from "../../../components/Input/TextFieldValidation";
import { LoadingBackdropComponent } from "../../../components/Layout/LoadingBackdropComponent";
import { IQuestionnaireService } from "../../../services/interfaces/IQuestionnaireService";
import ApiContext from "../../_context";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface State {
    loading: boolean
    questionnaire?: Questionnaire
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
            const questionnaire = await this.questionnaireService.getQuestionnaire(this.props.match.params.questionnaireId);
            this.setState({ questionnaire: questionnaire })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })
    }




    renderContent(): JSX.Element {
        if (!this.state.questionnaire)
            return <>Ingen</>

        const questionnaire = this.state.questionnaire;
        console.log(questionnaire)
        return (
            <IsEmptyCard object={questionnaire.questions} jsxWhenEmpty="Ingen spørgsmål på spørgeskema">
                <Grid container>
                    <Grid item xs={7}>


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
                                            onChange={() => { console.log("") }}
                                        />
                                    </CardContent>
                                </Card>
                            </Grid>
                            {questionnaire.questions?.filter(q => !q.enableWhen).map((question, index) => {
                                const childQuestion = questionnaire.questions?.filter(q => q.enableWhen?.questionId == question.Id)
                                return (
                                    <>
                                        <Grid item xs={12}>
                                            <QuestionEditCard
                                                addSubQuestionAction={(q) => this.addSubQuestion(q)}
                                                moveItemUp={() => this.MoveItemFromIndex(index, -1)}
                                                moveItemDown={() => this.MoveItemFromIndex(index, 1)}
                                                question={question} />
                                        </Grid>
                                        {childQuestion?.map(childQuestion => {
                                            return (
                                                <>
                                                    <Grid item xs={1} alignSelf="center" textAlign="center">
                                                        <ArrowForwardIosIcon fontSize="large"/>
                                                    </Grid>
                                                    <Grid item xs={11}>
                                                        <QuestionEditCard
                                                            moveItemUp={() => { console.log("") }}
                                                            moveItemDown={() => { console.log("") }}
                                                            parentQuestion={question}
                                                            question={childQuestion} />
                                                    </Grid>
                                                </>
                                            )
                                        })}

                                    </>
                                )
                            })}
                        </Grid>
                        <br/>
                        <Button variant="contained" onClick={() => console.log(this.state.questionnaire)}>
                            Gem
                        </Button>
                    </Grid>

                </Grid>

            </IsEmptyCard>
        )
    }

    tempQuestionId = 0;
    addSubQuestion(parrentQuestion: Question): void {
        const beforeUpdate = this.state.questionnaire;

        if (!beforeUpdate?.questions)
            return;

        const newQuestion = new Question();
        newQuestion.Id = "" + this.tempQuestionId++;
        const enableWhen = new EnableWhen<boolean>();
        enableWhen.questionId = parrentQuestion.Id;
        newQuestion.enableWhen = enableWhen;

        beforeUpdate.questions.push(newQuestion);

        this.setState({ questionnaire: beforeUpdate })
    }

    MoveItemFromIndex(index: number, step: number) : void{
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