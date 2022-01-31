import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { Card, CardContent, Typography } from "@mui/material";
import React from "react";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { QuestionnaireTable } from "../../components/Tables/QuestionnaireTable";
import { IQuestionnaireService } from "../../services/interfaces/IQuestionnaireService";
import ApiContext from "../_context";


interface State {
    loading: boolean
    questionnaires: Questionnaire[]
}

interface Props {
}

class QuestionnairePage extends React.Component<Props, State> {
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService

    constructor(props: Props) {
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
        this.questionnaireService = this.context.questionnaireService;
    }

    async componentDidMount(): Promise<void> {
        await this.populateCareplans()
    }

    async populateCareplans(): Promise<void> {
        try {
            const allQuestionnaires = await this.questionnaireService.GetAllQuestionnaires();
            this.setState({ questionnaires: allQuestionnaires })
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })
    }


    //=====================TABS===============================

    renderCareplanTab(): JSX.Element {
        return (
            <>
                <Typography variant="h6">Spørgeskemaer</Typography>
                <br />
                <IsEmptyCard jsxWhenEmpty="Ingen spørgeskemaer tilgængelige" list={this.state.questionnaires}>
                    <Card>
                        <QuestionnaireTable questionnaires={this.state.questionnaires} />
                    </Card>
                </IsEmptyCard>
            </>
        )
    }



}
export default QuestionnairePage;