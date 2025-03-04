import Chip from '@mui/material/Chip';
import React, { Component } from 'react';
import { Alert, AlertColor, Box, Button, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Tooltip, TableFooter } from '@mui/material';
import { CategoryEnum } from '../Models/CategoryEnum';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '../Models/QuestionnaireResponse';
import { QuestionnaireResponseStatusSelect } from '../Input/QuestionnaireResponseStatusSelect';
import ApiContext, { IApiContext } from '../../pages/_context';
import { IQuestionAnswerService } from '../../services/interfaces/IQuestionAnswerService';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { Questionnaire } from '../Models/Questionnaire';
import IDateHelper from '../Helpers/interfaces/IDateHelper';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import { PatientCareplan } from '../Models/PatientCareplan';
import { LoadingSmallComponent } from '../Layout/LoadingSmallComponent';
import { ErrorBoundary } from '../Errorhandling/ErrorBoundary'
import { Question, QuestionTypeEnum } from '../Models/Question';
import IsEmptyCard from '../Errorhandling/IsEmptyCard';
import { GroupAnswer } from '../Models/Answer';



export interface Props {
    questionnaires: Questionnaire
    careplan: PatientCareplan
}

export interface State {
    thresholdModalOpen: boolean
    questionnaireResponses: QuestionnaireResponse[]
    loading: boolean
    limit: number
    offset: number
    hidden: boolean
    total?: number
}

export class AnswerTable extends Component<Props, State> {
    static displayName = AnswerTable.name;

    static contextType = ApiContext


    questionAnswerService!: IQuestionAnswerService;
    questionnaireService!: IQuestionnaireService;
    datehelper!: IDateHelper

    constructor(props: Props) {
        super(props);

        this.state = {
            hidden: true,
            thresholdModalOpen: false,
            questionnaireResponses: [],
            loading: true,
            limit: 5,
            offset: 1
        }
    }

    render(): JSX.Element {
        this.InitializeServices();
        return this.renderTableData(this.props.questionnaires);
    }

    InitializeServices(): void {
        const api = this.context as IApiContext
        this.questionAnswerService = api.questionAnswerService;
        this.questionnaireService = api.questionnaireService;
        this.datehelper = api.dateHelper;
    }

    async componentDidMount(): Promise<void> {
        try {
            await this.populateData(this.state.offset)
        } catch (error: unknown) {
            this.setState(() => { throw error })
        }
    }
    async populateData(page: number): Promise<void> {
        this.setState({ loading: true })
        const careplan = this.props.careplan;


        const {list: questionnaireResponses, total} = await this.questionnaireService.GetQuestionnaireResponses(careplan!.id!, [this.props.questionnaires.id], page, this.state.limit)
    
        this.setState({ questionnaireResponses: [] }) //Without this the StatusSelect will not destroy and recreate status-component, which will result it to show wrong status (JIRA: RIM-103)

        this.setState({
            questionnaireResponses: questionnaireResponses,
            offset: page,
            loading: false,
            total: total
        })
    }


    async NextPage(): Promise<void> {
        const currenpage = this.state.offset;
        const nextPage = currenpage + 1
        await this.populateData(nextPage)

        this.forceUpdate()
    }

    async PreviousPage(): Promise<void> {
        const currenpage = this.state.offset;
        const nextPage = currenpage - 1
        await this.populateData(nextPage)

        this.forceUpdate()
    }

    getChipColorFromCategory(category: CategoryEnum): "error" | "warning" | "primary" | "default" | "success" {
        if (category === CategoryEnum.RED)
            return "error"
        if (category === CategoryEnum.YELLOW)
            return "warning"
        if (category === CategoryEnum.GREEN)
            return "success"
        if (category === CategoryEnum.BLUE)
            return "primary"

        return "default"
    }

    getDisplaynameColorFromCategory(category: CategoryEnum): "Rød" | "Gul" | "Grøn" | "Ingen alarmgrænser for spørgsmål" {
        if (category === CategoryEnum.RED)
            return "Rød"
        if (category === CategoryEnum.YELLOW)
            return "Gul"
        if (category === CategoryEnum.GREEN)
            return "Grøn"

        return "Ingen alarmgrænser for spørgsmål"
    }


    statusUpdate(status: QuestionnaireResponseStatus, questionnaireResponse: QuestionnaireResponse): void {
        questionnaireResponse.status = status;
        this.forceUpdate();

    }

    sortQuestionsForQuestionnaire(allQuestions: Question[], questionnaire: Questionnaire): Question[] {
        const result: Question[] = [];

        //result.push(...allQuestions)
        // tilføj spørgmål der er i det spørgeskemaet sorteres efter den rækkefølge de har her
        questionnaire.getParentQuestions().forEach(element => {
            console.log("kommer her: 1")
            result.push(element);
            result.push(...questionnaire.getChildQuestions(element.Id));

            // husk evt. deprecatede underspørgsmål til aktivt hovedspørgmål
            const deprecatedChildQuestions = allQuestions.filter(q => q.deprecated).filter(q => q.enableWhen !== undefined && q.enableWhen.questionId === element.Id);
            result.push(...deprecatedChildQuestions);
        });

        // tilføj alle deprecated spørgmål sorteret alfabetisk, med tilhørende underspørgmål
        allQuestions.filter(q => q.deprecated)
            .filter(q => q.enableWhen === undefined)
            .sort((a, b) => a.abbreviation!.localeCompare(b.abbreviation!))
            .forEach(question => {
                const childQuestions = allQuestions.filter(q => q.enableWhen !== undefined && q.enableWhen.questionId === question.Id);

                result.push(question);
                result.push(...childQuestions);
            })
            ;

        return result;
    }

    renderTableData(questionaire: Questionnaire): JSX.Element {
        if (this.state.loading)
            return (<LoadingSmallComponent />)

        const questionaireResponses = this.state.questionnaireResponses;
        if ((!questionaireResponses || questionaireResponses.length === 0) && this.state.offset === 1) {
            return (
                <>
                    <Typography>Ingen besvarelser for spørgeskema endnu. </Typography>
                    <Typography variant="caption">Spørgeskemaet besvares {questionaire.frequency!.ToString()}</Typography>
                </>
            )
        }


        const {offset, limit, total} = this.state;

        const hasMorePages: boolean = total ? offset * limit < total : false

        const questionnairesResponsesToShow = this.state.questionnaireResponses;
        const allQuestions = this.questionnaireService.findAllQuestions(questionnairesResponsesToShow);
        const sortedQuestions = this.sortQuestionsForQuestionnaire(allQuestions, this.props.questionnaires);
        const hasDeprecatedQuestions = allQuestions.filter(question => question.deprecated).length > 0;
        
        return (<>
            <Grid container spacing={3}>
                <Grid item xs={12} textAlign="right" alignItems="baseline" >
                    <Button sx={{ paddingRight: 2 }} disabled={this.state.offset <= 1} onClick={async () => await this.PreviousPage()} startIcon={<NavigateBeforeIcon />}>Nyere</Button>
                    <Button disabled={!hasMorePages} onClick={async () => await this.NextPage()} endIcon={<NavigateNextIcon />}>Ældre</Button>

                </Grid>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <IsEmptyCard list={this.state.questionnaireResponses} jsxWhenEmpty={"Ikke flere besvarelser"} >
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow className='table__row'>
                                        <TableCell width="10%">
                                        </TableCell>
                                        {questionaireResponses.map(questionResponse => {
                                            let severity = this.getChipColorFromCategory(questionResponse.category) as string

                                            if (questionResponse.status === QuestionnaireResponseStatus.Processed)
                                                severity = "info"

                                            return (
                                                <TableCell
                                                    className="answer__table-head"
                                                    align="center"
                                                >

                                                    <Stack className={'answer__header-color' + ' ' + severity} component={Alert} spacing={1} alignItems="center" alignContent="center" alignSelf="center" textAlign="center" icon={false} severity={severity as AlertColor} minWidth={"250px"}>
                                                        <div className="answer__header">
                                                            <Typography className="answer__headline" align="center">{questionResponse.answeredTime ? this.datehelper.DayIndexToDay(questionResponse.answeredTime.getUTCDay()) : ""}</Typography>
                                                            <Typography className="answer__date" align="center" variant="caption">{questionResponse.answeredTime ? this.datehelper.DateToString(questionResponse.answeredTime) : ""}</Typography>
                                                        </div>

                                                        <ErrorBoundary rerenderChildren={false}>
                                                            <QuestionnaireResponseStatusSelect onUpdate={status => this.statusUpdate(status, questionResponse)} questionnaireResponse={questionResponse} />
                                                        </ErrorBoundary>
                                                    </Stack>
                                                </TableCell>
                                            )
                                        })}
                                        {
                                            Array.from(Array(5 - questionaireResponses.length).keys()).map(() => {
                                                return (
                                                    <TableCell className="answer__table-head" align="center"></TableCell>
                                                )
                                            })
                                        }
                                    </TableRow>

                                </TableHead>
                                <TableBody>
                                    {sortedQuestions.filter(q => q.enableWhen === undefined).map(question => {
                                        const childQuestions = sortedQuestions.filter(q => q.enableWhen !== undefined && q.enableWhen.questionId === question.Id);

                                        return (
                                            <>
                                                {this.renderRow([question], questionnairesResponsesToShow)}
                                                {this.renderRow(childQuestions, questionnairesResponsesToShow)}
                                            </>
                                        )
                                    })}

                                </TableBody>

                                {hasDeprecatedQuestions && (
                                    <TableFooter>
                                        <Button sx={{ marginTop: 2, textTransform: "none", textAlign: "left" }} onClick={() => {
                                            const hidden = !this.state.hidden;
                                            this.setState({
                                                hidden: hidden
                                            })
                                        }}>{this.state.hidden ? "Vis" : "Skjul"} forældede spørgsmål</Button>
                                    </TableFooter>
                                )}

                            </Table>

                        </IsEmptyCard>



                    </TableContainer>
                </Grid>
            </Grid>
        </>
        )
    }
    renderRow(questionsToRender: Question[], questionnairesResponsesToShow: QuestionnaireResponse[]): JSX.Element {
        return (
            <>
                {questionsToRender.map(question => {
                    if (!question.deprecated || !this.state.hidden && question.deprecated)
                        return (
                            <TableRow>
                                <TableCell>
                                    <Typography color={question.deprecated ? "grey" : "black"} fontStyle={question.deprecated ? "italic" : ""}>
                                        {question.abbreviation ?? question.question} {question.deprecated ? "(forældet)" : ""}
                                    </Typography>
                                </TableCell>

                                {questionnairesResponsesToShow.map(questionResponse => {
                                    return this.renderSingleResponse(question, questionResponse)
                                })}
                            </TableRow>
                        )
                })}
            </>
        )
    }

    renderSingleResponse(question: Question, questionResponse?: QuestionnaireResponse): JSX.Element {
        if (questionResponse === undefined)
            return <TableCell></TableCell>

        const answer = this.questionnaireService.findAnswer(question, questionResponse);

        const thresholdCollection = this.props.questionnaires.thresholds?.find(x => x.questionId === question.Id);
        const category = answer && thresholdCollection ? this.questionAnswerService.FindCategory(thresholdCollection, answer) : CategoryEnum.BLUE
        
        const isGroupQuestion = question.type === QuestionTypeEnum.GROUP;
        if (isGroupQuestion) {
            const groupAnswer = answer as GroupAnswer;
            return (
                <TableCell>
                    <Grid container spacing={2} direction={'row'} alignItems={'center'}>
                        
                        {groupAnswer?.answer?.map(sa => {
                            const subQuestionThresholdCollection = this.props.questionnaires.thresholds?.find(x => x.questionId === sa.questionId);
                            const subAnswercategory = sa && subQuestionThresholdCollection ? this.questionAnswerService.FindCategory(subQuestionThresholdCollection, sa) : CategoryEnum.BLUE

                            return (
                                <>
                                  
                                    <Grid item xs={4} sx={{border:0}}>
                                        <Tooltip title={this.getDisplaynameColorFromCategory(category)}>
                                            <Chip className='answer__chip' component={Box} width="100%" size="medium" color={this.getChipColorFromCategory(subAnswercategory)} label={sa ? sa.ToString() : ""} variant="filled" />
                                        </Tooltip>
                                    </Grid>
                                    <Grid item sx={{border:0}}>
                                        <Typography>{this.getsubQuestionTest(question, sa.questionId)}</Typography>
                                    </Grid>
                                    
                                    
                                    </>

                            )
                        })}
                        
                    </Grid>
                </TableCell>
            )
        }
        else {
        return (
            <TableCell>
                {category === CategoryEnum.BLUE ?
                    <Tooltip title={this.getDisplaynameColorFromCategory(category)}>
                        <Typography textAlign="center"> {answer ? answer.ToString() : ""}</Typography>
                    </Tooltip> :

                    
                    <Tooltip title={this.getDisplaynameColorFromCategory(category)}>
                        <Chip className='answer__chip' component={Box} width="100%" size="medium" color={this.getChipColorFromCategory(category)} label={answer ? answer.ToString() : ""} variant="filled" />
                    </Tooltip>

                 
                }
            </TableCell>

        )
            }
    }

    getsubQuestionTest(question: Question, subQuestionId: string): string {
        return question.subQuestions?.find(sq => sq.Id === subQuestionId)?.measurementType?.displayName ?? "";
    }
}
