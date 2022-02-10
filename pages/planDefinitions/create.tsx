import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Typography } from "@mui/material";
import React from "react";
import { AccordianDims } from "../../components/Cards/PlanDefinition/AccordianDims";
import { PlanDefinitionEditAccordian } from "../../components/Cards/PlanDefinition/PlanDefinitionEditAccordian";
import { PlanDefinitionEditQuestionnaireAccordian } from "../../components/Cards/PlanDefinition/PlanDefinitionEditQuestionnaireAccordian";
import { LoadingBackdropComponent } from "../../components/Layout/LoadingBackdropComponent";
import ApiContext from "../_context";

interface State {
    loading: boolean
    planDefinition: PlanDefinition
    openAccordians: boolean[]
}

enum AccordianRowEnum {
    generelInfo,
    attachQuestionnaire,
    thresholds
}

export default class CreatePlandefinition extends React.Component<{}, State> {
    static contextType = ApiContext

    constructor(props: {}) {
        super(props)

        const accordian: boolean[] = [];
        accordian[AccordianRowEnum.generelInfo] = true;
        accordian[AccordianRowEnum.attachQuestionnaire] = false;
        accordian[AccordianRowEnum.thresholds] = false;
        const newPlanDefinition = new PlanDefinition()
        newPlanDefinition.questionnaires = []
        this.state = {
            loading: false,
            openAccordians: accordian,
            planDefinition: newPlanDefinition
        }

    }

    toggleAccordian(page: AccordianRowEnum, overrideExpanded?: boolean) : void{
        const oldAccordians = this.state.openAccordians
        oldAccordians[page] = overrideExpanded ?? !oldAccordians[page]
        this.setState({ openAccordians: oldAccordians })
    }

    expandNextPage(currentPage: AccordianRowEnum) : void{
        this.toggleAccordian(currentPage, false)
        switch (currentPage) {
            case AccordianRowEnum.generelInfo:
                this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)
                break
            case AccordianRowEnum.attachQuestionnaire:
                this.toggleAccordian(AccordianRowEnum.thresholds)
                break
        }
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
        return contents;
    }

    renderCareplanTab(): JSX.Element {
        return (
            <>
                <Typography variant="h6">Opret patientgruppe</Typography>
                <br />

                <AccordianDims
                    expanded={this.state.openAccordians[AccordianRowEnum.generelInfo]}
                    title="Patientgruppe"
                    toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.generelInfo)}
                    continueButtonAction={() => this.expandNextPage(AccordianRowEnum.generelInfo)}>

                    <PlanDefinitionEditAccordian planDefinition={this.state.planDefinition} />

                </AccordianDims>

                <AccordianDims
                    expanded={this.state.openAccordians[AccordianRowEnum.attachQuestionnaire]}
                    title="Patientgruppe"
                    toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)}
                    continueButtonAction={() => this.expandNextPage(AccordianRowEnum.attachQuestionnaire)}>
                    
                    <PlanDefinitionEditQuestionnaireAccordian planDefinition={this.state.planDefinition} />

                </AccordianDims>
            </>
        )
    }
}