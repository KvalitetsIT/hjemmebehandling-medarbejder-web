import IsEmptyCard from "@kvalitetsit/hjemmebehandling/Errorhandling/IsEmptyCard";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Card, Typography } from "@mui/material";
import React from "react";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { QuestionnaireTable } from "../../components/Tables/QuestionnaireTable";
import { IQuestionnaireService } from "../../services/interfaces/IQuestionnaireService";
import ApiContext from "../_context";


interface State {
    loading: boolean
    planDefinitions: PlanDefinition[]
}


class QuestionnairePage extends React.Component<{}, State> {
    static contextType = ApiContext
    questionnaireService!: IQuestionnaireService

    constructor(props: {}) {
        super(props);
        this.state = {
            loading: true,
            planDefinitions: []
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
            const allPlanDefinitions = await this.questionnaireService.GetAllPlanDefinitions();
            this.setState({ planDefinitions: allPlanDefinitions })
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
                <IsEmptyCard jsxWhenEmpty="Ingen spørgeskemaer tilgængelige" list={this.state.planDefinitions}>
                    <Card>
                        <QuestionnaireTable planDefinitions={this.state.planDefinitions} />
                    </Card>
                </IsEmptyCard>
            </>
        )
    }



}
export default QuestionnairePage;