import React, { Component, PropsWithChildren } from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface Props {
    expanded: boolean
    title: JSX.Element | string
    continueButtonAction?: () => void
    toggleExpandedButtonAction: () => void
    additionalButtonActions?: JSX.Element[]
    previousButtonAction?: () => void
    continueButtonContentOverride?: JSX.Element | string
    deactivateButtonText?: string
    deactivateButtonAction?: () => void
    overrideContinueButton?: JSX.Element
    error?: boolean;
    overrideDeactivateButton?: JSX.Element
}

export class AccordianWrapper extends Component<PropsWithChildren<Props>, {}> {
    
    static contextType = ApiContext
context!: React.ContextType<typeof ApiContext>   
    static displayName = AccordianWrapper.name;

    constructor(props: Props) {
        super(props);
    }

    errorArray: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();

    render(): JSX.Element {
        return (
            <Accordion sx={{ border: 1, borderColor: this.props.error ? "red" : "white" }} expanded={this.props.expanded} onChange={() => this.props.toggleExpandedButtonAction()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{ borderBottom: this.props.expanded ? "3px solid #f2f2f2" : "0" }}
                >
                    <Typography className="accordion__headline" sx={{ width: '33%', flexShrink: 0 }}>
                        {this.props.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {this.props.children}
                </AccordionDetails>
                <AccordionActions sx={{ justifyContent: 'space-between' }}>
                    <div>
                        {this.props.deactivateButtonText !== undefined ?
                            (
                                <>
                                    {this.props.overrideDeactivateButton ??
                                        (
                                            <Button
                                                color="error"
                                                onClick={() => this.props.deactivateButtonAction!()}
                                                className="accordion__button deactivate-button"
                                                variant="contained" >
                                                {this.props.deactivateButtonText}
                                            </Button>
                                        )
                                    }

                                </>
                            )
                            : <></>}
                    </div>
                    <div>
                        {this.props.previousButtonAction !== undefined ?
                            <Button onClick={() => this.props.previousButtonAction!()} className="accordion__button previous-button" variant="text" >Forrige</Button> : <></>
                        }
                        {this.props.additionalButtonActions && this.props.additionalButtonActions}
                        {this.props.overrideContinueButton ?
                            this.props.overrideContinueButton
                            :
                            (<Button onClick={() => this.props.continueButtonAction ? this.props.continueButtonAction() : {}} className="accordion__button continue-button" variant="contained">{this.props.continueButtonContentOverride ?? <>Fortsæt</>}</Button>)
                        }

                    </div>
                </AccordionActions>
            </Accordion>
        )
    }



}
