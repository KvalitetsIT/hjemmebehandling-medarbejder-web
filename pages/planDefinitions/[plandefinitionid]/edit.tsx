import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import React from "react";
import { LoadingBackdropComponent } from "../../../components/Layout/LoadingBackdropComponent";
import ApiContext from "../../_context";

interface State {
    loading: boolean
    planDefinitions?: PlanDefinition
}


export default class EditPlandefinition extends React.Component<{}, State> {
    static contextType = ApiContext

    constructor(props: {}) {
        super(props)
        this.state = {
            loading: true,
            planDefinitions: undefined
        }
    }

    render(): JSX.Element {
        const contents = this.state.loading ? <LoadingBackdropComponent /> : this.renderCareplanTab();
        return contents;
    }
    renderCareplanTab(): JSX.Element {
        throw new Error("Method not implemented.");
    }
}