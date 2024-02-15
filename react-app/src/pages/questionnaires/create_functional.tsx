import { BaseServiceError } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";
import { ToastError } from "@kvalitetsit/hjemmebehandling/Errorhandling/ToastError";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { ThresholdOption } from "@kvalitetsit/hjemmebehandling/Models/ThresholdOption";
import { MeasurementType } from '@kvalitetsit/hjemmebehandling/Models/MeasurementType';
import { BaseQuestion, CallToActionQuestion, Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire, QuestionnaireStatus } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Divider, Grid, Table, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import React, { useContext, useEffect, useMemo, useReducer, useState } from "react";
import { Prompt, Redirect } from "react-router-dom";
import { CallToActionCard } from "../../components/Cards/CallToActionCard";
import { QuestionEditCard } from "../../components/Cards/QuestionEditCard";
import { TextFieldValidation } from "../../components/Input/TextFieldValidation";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { IQuestionnaireService } from "../../services/interfaces/IQuestionnaireService";
import { IQuestionAnswerService } from '../../services/interfaces/IQuestionAnswerService';
import ApiContext, { IApiContext } from "../_context";
import { v4 as uuid } from 'uuid';
import { CriticalLevelEnum, InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { MissingDetailsError } from "../../components/Errors/MissingDetailsError";
import { BaseModelStatus } from "@kvalitetsit/hjemmebehandling/Models/BaseModelStatus";
import { ConfirmationButton } from "../../components/Input/ConfirmationButton";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import QuestionnaireService from "../../services/QuestionnaireService";
import { ValidateInputEvent, ValidateInputEventData } from "@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent";
import { QuestionEditCardF } from "../../components/Cards/QuestionEditCardF";
import { Frequency } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { string } from "yup";



interface Props {
    match: { params: { questionnaireId?: string } }
}

const CreateQuestionnairePageF = (props: Props) => {
    const sectionName = "questionnaire";
    const contextType = ApiContext

    const api = useContext(ApiContext)
    const questionnaireService: IQuestionnaireService = api.questionnaireService;
    const questionAnswerService: IQuestionAnswerService = api.questionAnswerService;

    //const validateEvent: ValidateInputEvent = new ValidateInputEvent(new ValidateInputEventData(sectionName)); //triggers validations of all fields

    const [loading, setLoading] = useState(true)
    const [questionnaire, setQuestionnaire] = useState<Questionnaire>()
    const [questionnaireIsInUse, setQuestionnaireIsInUse] = useState<boolean>()
    const [errorToast, setErrorToast] = useState(<></>)
    const [submitted, setSubmitted] = useState(false)
    const [editMode, setEditMode] = useState(props.match.params.questionnaireId ? true : false)
    const [errors, setErrors] = useState(new Map())
    const [changes, setChanges] = useState<string[]>([])
    const [allMeasurementTypes, setAllMeasurementTypes] = useState<MeasurementType[]>([])

    useEffect(() => {
        populateCareplans();

        function initCallToActions(questionnaire: Questionnaire) {
            //If there are no call-to-actions, we add one
            const hasCallToActionQuestion = questionnaire.getCallToActions().length > 0
            if (!hasCallToActionQuestion) {
                const newCallToActionQuestion = new CallToActionQuestion();
                newCallToActionQuestion.Id = generateQuestionId()
                newCallToActionQuestion.enableWhens = [];

                questionnaire.questions?.push(newCallToActionQuestion)
            }

            return questionnaire
        }

        async function populateCareplans(): Promise<void> {
            try {
              
                const questionnaireId = props.match.params.questionnaireId;
                let questionnaire = new Questionnaire();
                const question = new Question();
                question.Id = generateQuestionId();
                questionnaire.questions = [question];
                let questionnaireIsInUse = false;

                if (questionnaireId !== undefined) {
                    questionnaire = await questionnaireService.getQuestionnaire(questionnaireId) ?? questionnaire;
                    questionnaireIsInUse = await questionnaireService.IsQuestionnaireInUse(questionnaireId);
                } else {
                    addChange(question.Id);
                }

                questionnaire = initCallToActions(questionnaire)

                setQuestionnaire(questionnaire)
                setQuestionnaireIsInUse(questionnaireIsInUse)
            } catch (error) {
                //this.setState(() => { throw error })
                throw error
            }
            setLoading(false)
        }

        questionAnswerService.GetAllMeasurementTypes().then(
            measurementTypes => {
                setAllMeasurementTypes(measurementTypes)
            }
        )
    }, [questionAnswerService, questionnaireService, props.match.params.questionnaireId])


    return loading ? <LoadingBackdropComponent /> : renderContent();



    function questionnaireContainsMeasurementsWhichisNew(): boolean {
        if (editMode) {
            const questions = questionnaire?.questions?.filter(q => changes.includes(q.Id!)).filter(q => q.type === QuestionTypeEnum.OBSERVATION)

            return questions !== undefined && questions.length > 0
        }
        return false;
    }

    async function submitQuestionnaire(newStatus: QuestionnaireStatus | BaseModelStatus): Promise<void> {
        setLoading(true)

        //await validateEvent.dispatchEvent()
        //validateEvent.dispatchEvent()

        try {
            const valid = errors.size === 0

            if (valid && questionnaire !== undefined) {
                const manualValidationError1 = questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type === QuestionTypeEnum.BOOLEAN)
                    .map(q => questionnaire.thresholds!.find(t => t.questionId === q.Id))
                    .flatMap(tc => tc?.thresholdOptions ?? [])
                    .find(to => to.category === undefined)
                const manualValidationError2 = questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type === QuestionTypeEnum.OBSERVATION)
                    .find((q: Question) => q.measurementType === undefined);
                const manualValidationError3 = questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .find((q: Question) => q.type === undefined);
                const manualValidationError4 = questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type === QuestionTypeEnum.GROUP)
                    .flatMap((q: Question) => q.subQuestions!)
                    .find((q: Question) => q.measurementType === undefined);
                const manualValidationError5 = questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type === QuestionTypeEnum.CHOICE)
                    .find((q: Question) => q.options?.find(o => o.option === undefined || o.option === ''))

                if (manualValidationError1 || manualValidationError2 || manualValidationError3 || manualValidationError4 || manualValidationError5) {
                    console.log("manualValidationError", manualValidationError1, manualValidationError2, manualValidationError3, manualValidationError4, manualValidationError5)
                    throw new MissingDetailsError([]);
                }

                questionnaire.questions!
                    .filter(q => q instanceof Question)
                    .filter((q: Question) => q.type === QuestionTypeEnum.BOOLEAN)
                    .forEach((q: Question) => q.measurementType = undefined);

                const missingDetails: string[] = [];
                const questionnaires = await questionnaireService.GetAllQuestionnaires([BaseModelStatus.DRAFT, BaseModelStatus.ACTIVE])
                const names = questionnaires.filter(questionnaire => questionnaire.id !== questionnaire?.id).map(questionnaire => questionnaire.name);
                if (names.includes(questionnaire?.name) || names.includes(questionnaire?.name?.trim())) {
                    missingDetails.push("Navnet '" + questionnaire?.name + "' er allerede i brug")
                }
                if (missingDetails.length > 0) throw new MissingDetailsError(missingDetails);

                questionnaire.status = newStatus;

                if (questionnaire && editMode) await questionnaireService.updateQuestionnaire(questionnaire);

                if (questionnaire && !editMode) await questionnaireService.createQuestionnaire(questionnaire);

                setSubmitted(true)

            } else {
                throw new MissingDetailsError([]);
            }
        } catch (error) {
            if (error instanceof BaseServiceError) {
                setErrorToast(<ToastError severity="info" error={error} />)
            } else {
                //this.setState(() => { throw error })
                throw error
            }
        }

        setLoading(false)
    }

    async function validateQuestionnaireName(name: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (name.length <= 0) errors.push(new InvalidInputModel("Navn", "Navn er ikke udfyldt", CriticalLevelEnum.ERROR))
        return errors
    }


    function onValidation(uniqueId: string, error: InvalidInputModel[]): void {
        if (error.length === 0) {
            errors.delete(uniqueId)
        } else {
            errors.set(uniqueId, error)
        }
        setErrors(errors)
    }


    function renderContent(): JSX.Element {
        const prompt = (
            <Prompt
                when={true}
                message={() => "Du har ikke gemt eventuelle ændringerne - vil du fortsætte?"}
            />
        )

        if (submitted)
            return (<Redirect push to={"/questionnaires"} />)

        if (!questionnaire)
            return <>Ingen</>

        //const questions = questionnaire.questions?.filter(q => q.type !== QuestionTypeEnum.CALLTOACTION);


        const parentQuestions =  questionnaire.getParentQuestions()

        const allQuestions: Question[] = parentQuestions.map(question => {
            return [question, ...questionnaire.getChildQuestions(question.Id)];
        }).flat();

        const callToAction = questionnaire.getCallToActions()[0];

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
                                    key={questionnaire.id + "navn"}
                                    validate={(value) => validateQuestionnaireName(value)}
                                    onValidation={onValidation}
                                    sectionName={sectionName}
                                    label="Navn"
                                    value={questionnaire.name}
                                    size="medium"
                                    variant="outlined"
                                    uniqueId={questionnaire.id}
                                    /*disabled={this.state.questionnaire.status === BaseModelStatus.ACTIVE}*/
                                    onChange={input => {
                                        const q = new Questionnaire()
                                        q.name = input.target.value
                                        updateQuestionnaire(q)
                                    }}
                                />
                            </CardContent>
                        </Card>
                    </Grid>
                    {editMode ?
                        <Grid item xs={12}>
                            <Alert severity="warning"><strong>OBS!</strong> Du kan rediger <i>spørgsmålstype</i>, <i>målingstype</i> eller <i>triagering</i>, ved at oprette spørgsmålet på ny og slette det oprindelige. </Alert>
                        </Grid>
                        : null}

                    {parentQuestions?.map(question => {
                        const childQuestions = questionnaire.getChildQuestions(question.Id)

                        console.log("QUestion", question)

                        return (
                            <>
                                <Grid item xs={12}>
                                    <QuestionEditCardF
                                        key={question.Id}
                                        getThreshold={(question) => questionnaireService.GetThresholds(questionnaire, question)}
                                        addSubQuestionAction={(q, isParent) => addQuestion(q, isParent)}
                                        removeQuestionAction={(questionToRemove) => removeQuestion(questionToRemove, questionnaire)}
                                        moveItemUp={() => setQuestionnaire(questionnaireService.MoveQuestion(questionnaire, question, -1))}
                                        moveItemDown={() => setQuestionnaire(questionnaireService.MoveQuestion(questionnaire, question, 1))}
                                        question={question}
                                        onValidation={onValidation}
                                        sectionName={sectionName}
                                        disabled={!changes.includes(question.Id!)}
                                        deletable={parentQuestions.length <= 1}
                                        onUpdate = {q => { updateQuestion(q) }}
                                        allMeasurementTypes={allMeasurementTypes}
                                    />
                                </Grid>
                                {childQuestions?.map(childQuestion => {
                                    return (
                                        <>
                                            <Grid item xs={1} alignSelf="center" textAlign="center">
                                            </Grid>
                                            <Grid item xs={11}>
                                                <QuestionEditCardF
                                                    key={childQuestion.Id}
                                                    getThreshold={(question) => questionnaireService.GetThresholds(questionnaire, question)}
                                                    addSubQuestionAction={(q) => addQuestion(q, true, question.Id)}
                                                    removeQuestionAction={(questionToRemove) => removeQuestion(questionToRemove, questionnaire)}
                                                    moveItemUp={() => setQuestionnaire(questionnaireService.MoveQuestion(questionnaire, childQuestion, -1))}
                                                    moveItemDown={() => setQuestionnaire(questionnaireService.MoveQuestion(questionnaire, childQuestion, 1))}
                                                    parentQuestion={question}
                                                    question={childQuestion}
                                                    onValidation={onValidation}
                                                    sectionName={sectionName}
                                                    disabled={!changes.includes(childQuestion.Id!)}
                                                    onUpdate={updateQuestion}
                                                    allMeasurementTypes={allMeasurementTypes}
                                                />
                                            </Grid>
                                        </>
                                    )
                                })}
                            </>
                        )
                    })}
                    <Grid item xs={12}>
                        <CallToActionCard allQuestions={allQuestions} callToActionQuestion={callToAction!} sectionName={sectionName} onValidation={onValidation} />
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Typography>Hvis du ønsker at arbejde videre på spørgeskemaet, skal du gemme som kladde og kan fortsætte oprettelsen på et senere tidspunkt. Er du derimod færdig med spørgeskemaet, skal du blot trykke gem.</Typography>
                            </CardContent>
                            <Divider />
                            <TableContainer component={Card}>
                                <Table sx={{ width: '100%' }} aria-label="simple table">
                                    <TableRow>
                                        <TableCell align="left">
                                            {editMode ?
                                                <CardActions sx={{ display: "flex", justifyContent: "left" }}>
                                                    <ConfirmationButton
                                                        color="error"
                                                        variant="outlined"
                                                        title={"Inaktiver spørgeskema"}
                                                        action={async () => {
                                                            await deactivateQuestionnaire();
                                                        }}
                                                        skipDialog={false}
                                                        buttonText={"Inaktivere spørgskema"}
                                                        contentOfCancelBtn={"Fortryd"}
                                                        contentOfDoActionBtn={"Inaktiver"}                                                    >
                                                        <Typography>Ønsker du at inaktivere spørgskemaet {questionnaire.name}? </Typography>
                                                    </ConfirmationButton>
                                                </CardActions>
                                                :
                                                null
                                            }
                                        </TableCell>
                                        <TableCell align="right">
                                            <CardActions sx={{ display: "flex", justifyContent: "right" }}>
                                                <Button className='draft-button'
                                                    variant="contained"
                                                    disabled={(questionnaire.id !== undefined) && (questionnaire.status !== undefined && (questionnaire.status !== BaseModelStatus.DRAFT))}
                                                    onClick={() => {
                                                        const newStatus = Questionnaire.stringToQuestionnaireStatus("DRAFT");
                                                        submitQuestionnaire(newStatus).then(() => { })//validateEvent.dispatchEvent())
                                                    }}
                                                >Gem som kladde</Button>
                                                <ConfirmationButton
                                                    color="primary"
                                                    variant="contained"
                                                    contentOfDoActionBtn="Forstået"
                                                    contentOfCancelBtn="Fortryd"
                                                    action={async () => {
                                                        const newStatus = Questionnaire.stringToQuestionnaireStatus("ACTIVE");
                                                        submitQuestionnaire(newStatus).then(() => { })//validateEvent.dispatchEvent()).catch(() => console.log("SUBMIT.. men med fejl"))
                                                    }}

                                                    skipDialog={!(questionnaireIsInUse && questionnaireContainsMeasurementsWhichisNew())}
                                                    buttonText={'Gem og aktivér'}
                                                    title="Definer alarmgrænser"
                                                >
                                                    <Typography>Alarmgrænser skal defineres for den/de nye målinger, der er tilføjet, ellers vil der ikke blive triageret på rød, gul, grøn. Alarmgrænserne defineres i den/de patiengrupper, hvor spørgeskemaet er tilføjet.</Typography>
                                                </ConfirmationButton>
                                            </CardActions>
                                        </TableCell>
                                    </TableRow>
                                </Table>
                            </TableContainer>
                        </Card>
                    </Grid>
                </Grid>
                {errorToast ?? <></>}
            </>
        )
    }

    function removeQuestion(questionToRemove: Question, questionnaire: Questionnaire): void {
        setQuestionnaire(questionnaireService.RemoveQuestion(questionnaire, questionToRemove))
        removeChange(questionToRemove.Id!)
    }


    function generateQuestionId(): string {
        const newID = uuid();

        return newID;
    }

    function addQuestion(referenceQuestion: Question | undefined, isParent: boolean, enableWhenQuestionId?: string): void {
        const beforeUpdate = questionnaire;

        if (!beforeUpdate?.questions)
            return;
        const newQuestion = new Question();
        newQuestion.Id = generateQuestionId()
        if (referenceQuestion && isParent) {
            const enableWhen = new EnableWhen<boolean>();
            enableWhen.questionId = enableWhenQuestionId ?? referenceQuestion.Id;
            newQuestion.enableWhen = enableWhen;
        }

        const indexOfRefQuestion = beforeUpdate.questions.findIndex(q => q.Id === referenceQuestion?.Id)
        beforeUpdate.questions.splice(indexOfRefQuestion + 1, 0, newQuestion)
        setQuestionnaire(beforeUpdate)
        addChange(newQuestion.Id!)
    }


    function updateQuestion(updatedQuestion: Question): void {


        const newQuestion: Question= {...updatedQuestion}


        console.log("newQuestion", newQuestion)

        const question = questionnaire?.questions?.find(question => question.Id) as Question

        question.abbreviation = updatedQuestion.abbreviation
        question.helperText = updatedQuestion.helperText 

    }



    function addChange(id: string): void {
        setChanges([...changes, id])
    }

    function removeChange(id: string): void {
        setChanges(changes.filter(x => x !== id))
    }

    function updateQuestionnaire(updatedQuestionaire: Questionnaire): void {
        
        //let newQuestionnaire: Questionnaire = Object.assign( questionnaire!, updatedQuestionaire)
        
        console.log("questionnaire", questionnaire, " + " , updatedQuestionaire , " > " , )
        //setQuestionnaire(newQuestionnaire)
    }

  

    function deactivateQuestionnaire(): void {
        if (questionnaire && editMode) {
            questionnaireService.retireQuestionnaire(questionnaire)
                .then(() => {
                    setSubmitted(true)
                })
                .catch((error) => {
                    setErrorToast(<ToastError key={new Date().getTime()} error={error}></ToastError>)
                });
        }
    }
}

export default CreateQuestionnairePageF
