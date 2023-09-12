import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Button, Card, Grid, Typography } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import { PlanDefinitionTable } from "../../components/Tables/PlanDefinitionTable";
import { IPlanDefinitionService } from "../../services/interfaces/IPlanDefinitionService";
import ApiContext, { IApiContext } from "../_context";

interface State {
    loading: boolean
    planDefinitions: PlanDefinition[]
}


export default class PlandefinitionOverview extends React.Component<{}, State> {
    static contextType = ApiContext
   
     
    
    planDefinitionService!: IPlanDefinitionService


    constructor(props: {}) {
        super(props)
         
        this.state = {
            loading: true,
            planDefinitions: []
        }
    }
    async componentDidMount(): Promise<void> {
        try {
            const planDefinitions = await this.planDefinitionService.GetAllPlanDefinitions([]);
            this.setState({ planDefinitions: planDefinitions });
        } catch (error) {
            this.setState(() => { throw error })
        }
        this.setState({ loading: false })

    }
    initialiseServices(): void {
        const api = this.context as IApiContext
        this.planDefinitionService =   api.planDefinitionService;
    }
    render(): JSX.Element {
        this.initialiseServices();
        const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
        return contents;
    }
    renderCareplanTab(): JSX.Element {
        return (
            <>
                <Grid container alignItems="center" spacing={1.5}>
                    <Grid item xs={6}>
                        <Typography variant="h6">Patientgrupper</Typography>
                    </Grid>
                    <Grid item xs={6} textAlign="right">
                        <Button variant="contained" component={Link} to="/plandefinitions/create" >Opret patientgruppe</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Card>
                            <PlanDefinitionTable planDefinitions={this.state.planDefinitions} />
                        </Card>
                    </Grid>
                </Grid>

                <br />



            </>
        )
    }
}