import React, { Component } from 'react';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, Button, Typography } from '@mui/material';
import ApiContext from '../../../pages/_context';
import { InvalidInputModel } from '@kvalitetsit/hjemmebehandling/Errorhandling/ServiceErrors/InvalidInputError';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export interface Props {
    expanded : boolean
    title : JSX.Element | string
    continueButtonAction: () => void
    toggleExpandedButtonAction: () => void
}

export class AccordianDims extends Component<Props, {}> {
    static contextType = ApiContext;
    static displayName = AccordianDims.name;

    constructor(props: Props) {
        super(props);
    }

    errorArray: Map<number, InvalidInputModel[]> = new Map<number, InvalidInputModel[]>();

    render(): JSX.Element {
        return (
            <Accordion expanded={this.props.expanded} onChange={() => this.props.toggleExpandedButtonAction()}>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography className="accordion__headline" sx={{ width: '33%', flexShrink: 0 }}>
                        {this.props.title}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {this.props.children}
                </AccordionDetails>
                <AccordionActions>
                    <Button onClick={()=>this.props.continueButtonAction()} className="accordion__button" variant="contained">Fortsæt</Button>
                </AccordionActions>
            </Accordion>
        )
    }



}
