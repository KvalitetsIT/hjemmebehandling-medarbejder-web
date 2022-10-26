import React, { Component } from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface Props {
    expanded: boolean
    title: JSX.Element | string
    continueButtonAction: () => void
    toggleExpandedButtonAction: () => void
    additionalButtonActions?: JSX.Element[]
    previousButtonAction?: () => void
    continueButtonContentOverride?: JSX.Element | string
    error?: boolean;
    
}

export class AccordianWrapper extends Component<Props, {}> {
    static contextType = ApiContext;
    static displayName = AccordianWrapper.name;

    constructor(props: Props) {
        super(props);
    }

    errorArray: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();

    render(): JSX.Element {
        return (
            <Accordion sx={{border: 1, borderColor: this.props.error ? "red":"white"}} expanded={this.props.expanded} onChange={() => this.props.toggleExpandedButtonAction()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                    sx={{borderBottom: this.props.expanded ? "3px solid #f2f2f2" : "0"}}
                >
                    <Typography className="accordion__headline" sx={{ width: '33%', flexShrink: 0 }}>
                        {this.props.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {this.props.children}
                </AccordionDetails>
                <AccordionActions>
                    {this.props.previousButtonAction != undefined ?
                        <Button onClick={() => this.props.previousButtonAction!()} className="accordion__button" variant="text">Forrige</Button> : <></>
                    }

                    {this.props.additionalButtonActions && this.props.additionalButtonActions}

                    <Button onClick={() => this.props.continueButtonAction()} className="accordion__button" variant="contained">{this.props.continueButtonContentOverride ?? <>Fortsæt</>}</Button>
                </AccordionActions>
            </Accordion>
        )
    }



}
