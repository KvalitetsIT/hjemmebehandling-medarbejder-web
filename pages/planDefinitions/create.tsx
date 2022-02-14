import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { Typography } from "@mui/material";
import React from "react";
import { AccordianWrapper } from "../../components/Cards/PlanDefinition/AccordianWrapper";
import { PlanDefinitionEdit } from "../../components/Cards/PlanDefinition/PlanDefinitionEdit";
import { PlanDefinitionEditQuestionnaire } from "../../components/Cards/PlanDefinition/PlanDefinitionEditQuestionnaire";
import { PlanDefinitionEditThresholds } from "../../components/Cards/PlanDefinition/PlanDefinitionEditThresholds";
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

    toggleAccordian(page: AccordianRowEnum, overrideExpanded?: boolean): void {
        const oldAccordians = this.state.openAccordians
        oldAccordians[page] = overrideExpanded ?? !oldAccordians[page]
        this.setState({ openAccordians: oldAccordians })
    }

    expandNextPage(currentPage: AccordianRowEnum): void {
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

                <AccordianWrapper
                    expanded={this.state.openAccordians[AccordianRowEnum.generelInfo]}
                    title="Patientgruppe"
                    toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.generelInfo)}
                    continueButtonAction={() => this.expandNextPage(AccordianRowEnum.generelInfo)}>

                    <PlanDefinitionEdit planDefinition={this.state.planDefinition} />

                </AccordianWrapper>

                <AccordianWrapper
                    expanded={this.state.openAccordians[AccordianRowEnum.attachQuestionnaire]}
                    title="Tilknyt spørgeskema"
                    toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.attachQuestionnaire)}
                    continueButtonAction={() => this.expandNextPage(AccordianRowEnum.attachQuestionnaire)}>

                    <PlanDefinitionEditQuestionnaire planDefinition={this.state.planDefinition} />

                </AccordianWrapper>

                <AccordianWrapper
                    expanded={this.state.openAccordians[AccordianRowEnum.thresholds]}
                    title="Alarmgrænser"
                    toggleExpandedButtonAction={() => this.toggleAccordian(AccordianRowEnum.thresholds)}
                    continueButtonAction={() => console.log(this.state.planDefinition)}>

                    <PlanDefinitionEditThresholds planDefinition={this.state.planDefinition} />


                </AccordianWrapper>
            </>
        )
    }
}