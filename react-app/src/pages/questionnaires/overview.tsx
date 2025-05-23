import { Button, Card, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { QuestionnaireTable } from "../../components/Tables/QuestionnaireTable";
import { IQuestionnaireService } from "../../services/interfaces/IQuestionnaireService";
import ApiContext, { IApiContext } from "../_context";
import IsEmptyCard from "../../components/Errorhandling/IsEmptyCard";
import { Questionnaire } from "../../components/Models/Questionnaire";


interface State {
    loading: boolean
    questionnaires: Questionnaire[]
}


class QuestionnaireOverviewPage extends React.Component<{}, State> {
    static contextType = ApiContext;

    questionnaireService!: IQuestionnaireService

    constructor(props: {}) {
        super(props);
        
        this.state = {
            loading: true,
            questionnaires: []
        }
    }

    render(): JSX.Element {
        this.InitializeServices();
        const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
        return contents;
    }
    InitializeServices(): void {
        const api = this.context as IApiContext
        this.questionnaireService =  api.questionnaireService;
    }

    async componentDidMount(): Promise<void> {
        await this.populateCareplans()
    }

    async populateCareplans(): Promise<void> {
        try {
            const questionnaires = await this.questionnaireService.GetAllQuestionnaires([]);
            this.setState({ questionnaires: questionnaires })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })
    }


    //=====================TABS===============================

    renderCareplanTab(): JSX.Element {
        return (
            <>
                <Grid container alignItems="center" spacing={1.5}>
                    <Grid item xs={6}>
                        <Typography variant="h6">Spørgeskemaer</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Button variant="contained" component={Link} to="/questionnaires/create">Opret spørgeskema</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <IsEmptyCard jsxWhenEmpty="Ingen spørgeskemaer tilgængelige" list={this.state.questionnaires}>
                            <Card>
                                <QuestionnaireTable questionnaires={this.state.questionnaires} />
                            </Card>
                        </IsEmptyCard>
                    </Grid>
                </Grid>
            </>
        )
    }



}
export default QuestionnaireOverviewPage;