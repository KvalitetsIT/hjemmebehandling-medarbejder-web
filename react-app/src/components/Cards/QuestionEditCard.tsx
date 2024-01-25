import { Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Alert, Box, Button, ButtonGroup, Card, CardActions, CardContent, CardHeader, Divider, Grid, GridSize, IconButton, Stack, Table, TableCell, TableContainer, TableRow } from "@mui/material";
import { Component, Key, ReactNode } from "react";
import { EnableWhenSelect } from "../Input/EnableWhenSelect";
import { QuestionTypeSelect } from "../Input/QuestionTypeSelect";
import { TextFieldValidation } from "../Input/TextFieldValidation";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CategorySelect } from "../Input/CategorySelect";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { QuestionMeasurementTypeSelect } from "../Input/QuestionMeasurementTypeSelect";
import {InvalidInputModel } from "@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError";
import { Tooltip } from '@mui/material'
import { v4 as uuid } from 'uuid';
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";

interface Props {
    key: Key | null | undefined
    parentQuestion?: Question
    question: Question
    getThreshold?: (question: Question) => ThresholdCollection
    addSubQuestionAction?: (referenceQuestion: Question | undefined, isParent: boolean) => void
    removeQuestionAction: (questionToRemove: Question) => void
    moveItemUp: (question: Question) => void
    moveItemDown: (question: Question) => void
    onValidation: (uniqueId: string, error: InvalidInputModel[]) => void
    sectionName?: string
    disabled: boolean
    deletable?: boolean
    onUpdate: (updatedQuestion: Question) => void
    allMeasurementTypes: MeasurementType[]
}
interface State {
}

export class QuestionEditCard extends Component<Props, State>{
    static defaultProps = {
    }

    constructor(props: Props) {
        super(props);
    }

    async validateAbbreviation(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("abbreviation", "Forkortelse til kliniker mangler"))
        return errors
    };

    async validateQuestionName(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("question", "Spørgsmål er endnu ikke udfyldt"))
        return errors
    }
/*
    async validateHelperText(value: string): Promise<InvalidInputModel[]> {
        const errors: InvalidInputModel[] = []
        if (value.length <= 0) errors.push(new InvalidInputModel("helperText", "hjælpetekst er endnu ikke udfyldt"))
        return errors
    }
*/

    render(): ReactNode {
        const parrentQuestion = this.props.parentQuestion;
        const parentQuestionHasGoodType = parrentQuestion === undefined || parrentQuestion?.type === QuestionTypeEnum.BOOLEAN
        const shouldShowThresholds = this.props.question.type === QuestionTypeEnum.BOOLEAN
        const className = this.props.parentQuestion !== undefined ? "focusedChildQuestionEditCard" : "focusedParentQuestionEditCard"
        return (
            <Card>

                <Grid key={this.props.key} container columns={48}>
                    <Grid sx={{ display: "flex", justifyContent: "space-between", flexDirection: "column" }} paddingTop={2} paddingBottom={2} className={className} item xs={1} >
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemUp(this.props.question)}><KeyboardArrowUpIcon fontSize="large" /></Button>
                        <Button sx={{ minWidth: 0 }} onClick={() => this.props.moveItemDown(this.props.question)}><KeyboardArrowDownIcon fontSize="large" /></Button>
                    </Grid>
                    <Grid item xs={47 as GridSize}>
                        <CardHeader subheader={
                            <><div>
                                
                                    {this.props.parentQuestion ?

                                     <Grid container marginTop={1} marginBottom={3} columns={12}>
                                        <Grid item xs={12}>
                                            <Box>
                                                <EnableWhenSelect
                                                    enableWhen={this.props.question.enableWhen!}
                                                    parentQuestion={this.props.parentQuestion}
                                                    sectionName={this.props.sectionName} />
                                            </Box>
                                        </Grid>
                                     </Grid>
                                      : <></>
                                    }
                                <Grid container marginTop={1} columns={12}>

                                    <Grid item xs>
                                        <TextFieldValidation
                                            label="Spørgsmål"
                                            value={this.props.question.question}
                                            variant="outlined"
                                            size="medium"
                                            minWidth={500}
                                            uniqueId={this.props.question.Id!+'_question'}
                                            onValidation={this.props.onValidation}
                                            validate={this.validateQuestionName}
                                            onChange={input => {
                                                const newValue = input.currentTarget.value;
                                                this.props.onUpdate({...this.props.question, question: newValue})
                                            }}
                                            sectionName={this.props.sectionName}
                                        />

                                    </Grid>
                                    <Grid item xs="auto">
                                        <TextFieldValidation
                                            label="Forkortelse til kliniker"
                                            value={this.props.question.abbreviation}
                                            variant="outlined"
                                            size="medium"
                                            uniqueId={this.props.question.Id!+'_abbreviation'}
                                            onChange={input => {
                                                const newValue = input.currentTarget.value;
                                                this.props.onUpdate({...this.props.question, abbreviation: newValue})
                                            }}
                                            onValidation={this.props.onValidation}
                                            validate={this.validateAbbreviation}
                                            sectionName={this.props.sectionName}
                                        />
                                    </Grid>

                                </Grid>
                                </div>
                            </>
                        } />
                        {parentQuestionHasGoodType ? <></> :
                            <Alert color="warning">
                                Overspørgsmålets spørgsmålstype understøtter ikke underspørgsmål - Dette spørgsmål vil blive slettet
                            </Alert>
                        }

                        <Divider />
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid item xs>
                                    <TextFieldValidation
                                        label="Hjælpetekst"
                                        value={this.props.question.helperText}
                                        variant="outlined"
                                        size="medium"
                                        uniqueId={this.props.question.Id!+'_helperText'}
                                        minWidth={800}
                                        onChange={input => {
                                            const newValue = input.currentTarget.value;
                                                this.props.onUpdate({...this.props.question, helperText: newValue})
                                        }}
                                        required
                                        sectionName={this.props.sectionName}
                                        onValidation={this.props.onValidation}
                                    />
                                </Grid>
                                <Grid item xs>
                                    <QuestionTypeSelect
                                        question={this.props.question}
                                        sectionName={this.props.sectionName}
                                        onValidation={this.props.onValidation}
                                        disabled={this.props.disabled}
                                        uniqueId={this.props.question.Id!+'_questionType'}
                                        onChange={input => {
                                            const newValue = input.target.value as unknown as QuestionTypeEnum
                                            this.props.onUpdate({...this.props.question, type: newValue})
                                        }}
                                    />
                                </Grid>
                            </Grid>
                            {
                                /*
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    {this.state.question.type === QuestionTypeEnum.OBSERVATION ?
                                      <QuestionMeasurementTypeSelect  
                                        sectionName={this.props.sectionName} 
                                        onValidation={this.props.onValidation} 
                                        disabled={this.props.disabled} 
                                        forceUpdate={this.forceCardUpdate}
                                        question={this.state.question} 
                                        uniqueId={this.props.question.Id!+'_measurementType'}
                                        />

                                        : <></>}
                                </Grid>
                                <Grid item xs={4}>
                                <Button className="add-child-question" sx={{ padding: 2 }} onClick={() => this.props.addSubQuestionAction!(this.props.question, true)}>
                                <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                Tilføj yderligere måling
                            </Button>
                                </Grid>
                            </Grid>
                                    */
                                }


                            {this.props.question.type === QuestionTypeEnum.OBSERVATION || this.props.question.type === QuestionTypeEnum.GROUP ? 
                                this.renderObservationBlock(this.props.question)
                                
                                :
                                <></>
                            }

                            {shouldShowThresholds ? this.renderBooleanThreshold() : <></>}

                        </CardContent>

                        <Divider />
                        <CardActions disableSpacing>
                            <Button className="add-child-question" sx={{ padding: 2 }} disabled={this.props.question.type !== QuestionTypeEnum.BOOLEAN || this.props.parentQuestion !== undefined} onClick={() => this.props.addSubQuestionAction!(this.props.question, true)}>
                                <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                Tilføj underspørgsmål
                            </Button>

                            <Stack direction="row" spacing={2} sx={{ marginLeft: "auto" }}>
                                <ButtonGroup variant="text" >
                                    <Tooltip title='Slet' placement='right'>
                                        <IconButton sx={{ color: '#5D74AC', padding: 2 }} className="delete-question" disabled={this.props.deletable} onClick={() => this.props.removeQuestionAction(this.props.question)}>
                                            <DeleteOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                    <Button disabled={this.props.parentQuestion !== undefined} sx={{ padding: 2 }} onClick={() => this.props.addSubQuestionAction!(this.props.question, false)}>
                                        <AddCircleIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                        Tilføj nyt spørgsmål
                                    </Button>
                                </ButtonGroup>
                            </Stack>
                        </CardActions>

                    </Grid>
                </Grid>
            </Card>
        )
    }

    renderObservationBlock(question: Question): JSX.Element {
        let renderQuestions : Question[] = [];
        if (question.type === QuestionTypeEnum.OBSERVATION) {
            renderQuestions.push(question);
        }
        else if (question.type === QuestionTypeEnum.GROUP) {
            renderQuestions.push(...question.subQuestions!);
        }
        
        return (
            <TableContainer>
                <Table>
                    {renderQuestions.map((question, index) => {
                        const isLast = renderQuestions.length-1 == index
                        return (
                            <TableRow>
                                <TableCell>
                                    <Stack direction="row" spacing={2} >
                                        <QuestionMeasurementTypeSelect  
                                            sectionName={this.props.sectionName} 
                                            onValidation={this.props.onValidation} 
                                            disabled={this.props.disabled}
                                            question={question} 
                                            uniqueId={question.Id!}
                                            onChange={input => {
                                                const clickedMeasurementCode = input.target.value
                                                const clicked = this.props.allMeasurementTypes.find(mt => mt.code === clickedMeasurementCode);

                                                if (this.props.question.type === QuestionTypeEnum.GROUP) {
                                                    //find correct subQuestion to update
                                                    const subQuestion = this.props.question.subQuestions?.find(sq => sq.Id === question.Id);
                                                    subQuestion!.measurementType =  clicked
                                                    this.props.onUpdate({...this.props.question})
                                                }
                                                else {
                                                    this.props.onUpdate({...this.props.question, measurementType: clicked})
                                                }
                                            }}
                                             allMeasurementTypes={this.props.allMeasurementTypes}
                                        />

                                        <ButtonGroup variant="text" >
                                            <Tooltip title='Slet' placement='right'>
                                                <IconButton sx={{ color: '#5D74AC', padding: 2 }} className="delete-question" disabled={renderQuestions.length == 1} onClick={() => this.removeObservation(question)}>
                                                    <DeleteOutlineIcon />
                                                </IconButton>
                                            </Tooltip>
                                            {isLast ? 
                                                <Button className="add-child-question" sx={{ padding: 2 }} disabled={question.measurementType == undefined} onClick={() => this.addObservation()}>
                                                    <AddCircleOutlineIcon sx={{ paddingRight: 1, width: 'auto' }} />
                                                    Tilføj yderligere måling
                                                </Button>
                                                : 
                                                <></>
                                            }
                                        </ButtonGroup>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                            )
                        })
                    }
                </Table>
            </TableContainer>
        )
    }

    removeObservation(removeQuestion: Question): void {
        const question = {...this.props.question};
        question.subQuestions = question.subQuestions?.filter(sq => sq.Id !== removeQuestion.Id/*!sq.isEqual(removeQuestion)*/);

        if (question.subQuestions?.length == 1) {
            const subQuestion = question.subQuestions[0];
            question.measurementType = subQuestion.measurementType
            question.type = QuestionTypeEnum.OBSERVATION;
            question.subQuestions = [];
        }
        this.props.onUpdate(question)
    }

    addObservation(): void {
        let question = {...this.props.question};
        if (question.type === QuestionTypeEnum.OBSERVATION) {
            const subQuestion = new Question();
            subQuestion.Id = uuid();
            subQuestion.measurementType = question.measurementType;
            subQuestion.type = QuestionTypeEnum.OBSERVATION; 
            
            question.type = QuestionTypeEnum.GROUP;
            question.measurementType = undefined;
            question.subQuestions = [subQuestion];
        }
        const newSubQuestion = new Question();
        newSubQuestion.Id = uuid();
        newSubQuestion.type = QuestionTypeEnum.OBSERVATION;
        
        question.subQuestions!.push(newSubQuestion);

        this.props.onUpdate(question);
    }
    renderBooleanThreshold(): JSX.Element {

        if (!this.props.getThreshold)
            return <></>

        const thresholdCollection = this.props.getThreshold(this.props.question)

        return (
            <TableContainer>
                <Table>
                    {thresholdCollection.thresholdOptions?.map(option => {
                        return (
                            <TableRow>
                                <TableCell>
                                    {option.option === "true" ? "Ja" : "Nej"}
                                </TableCell>
                                <TableCell>
                                    <CategorySelect 
                                        sectionName={this.props.sectionName} 
                                        disabled={this.props.disabled} 
                                        category={option.category} 
                                        onChange={(newCategory) => { option.category = newCategory }} 
                                        onValidation={this.props.onValidation}
                                        uniqueId={this.props.question.Id!+option.option}
                                    />
                                </TableCell>
                            </TableRow>
                        )   
                    })}
                </Table>
            </TableContainer>
        )
    }
}