import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { Toast } from '@kvalitetsit/hjemmebehandling/Errorhandling/Toast';
import { Typography } from '@mui/material';
import { ValidateInputEvent, ValidateInputEventData } from '@kvalitetsit/hjemmebehandling/Events/ValidateInputEvent';
import { CreateToastEvent, CreateToastEventData } from '@kvalitetsit/hjemmebehandling/Events/CreateToastEvent';

export interface Props {
  questionnaireResponse: QuestionnaireResponse
  onUpdate: (newStatus: QuestionnaireResponseStatus) => void;
}

export interface State {
  status?: QuestionnaireResponseStatus;
}

export class QuestionnaireResponseStatusSelect extends Component<Props, State> {
  static displayName = QuestionnaireResponseStatusSelect.name;
  static contextType = ApiContext
  questionnaireService!: IQuestionnaireService

  constructor(props: Props) {
    super(props);
    this.state = {
      status: props.questionnaireResponse.status
    }
  }

  InitializeServices(): void {
    this.questionnaireService = this.context.questionnaireService;
  }

  handleChange = async (event: SelectChangeEvent): Promise<void> => {
    const collectionStatus = event.target.value as QuestionnaireResponseStatus;
    const changes = new QuestionnaireResponse();
    changes.status = collectionStatus;

    new CreateToastEvent(new CreateToastEventData("Opdaterer ...", "info", "black")).dispatchEvent();

    this.setState({ status: collectionStatus })


    try {
      const newStatus = await this.questionnaireService.UpdateQuestionnaireResponseStatus(this.props.questionnaireResponse.id, collectionStatus)

      new CreateToastEvent(new CreateToastEventData("Ny status: " + changes.status, "success")).dispatchEvent();

      this.setState({ status: newStatus })
    } catch (error: unknown) {
      this.setState(() => { throw error })
    }

    if (this.props.onUpdate)
      this.props.onUpdate(this.state.status!);
  };

  GetQuestionnaireCategoryClassName(category?: CategoryEnum): string {
    if (!category) {
      return ""
    }

    switch (category) {
      case CategoryEnum.RED:
        return "red-answer"
      case CategoryEnum.YELLOW:
        return "yellow-answer"
      case CategoryEnum.GREEN:
        return "green-answer"
      /*case CategoryEnum.BLUE :
        return "blue"*/
    }
  }


  render(): JSX.Element {
    this.InitializeServices()
    const height = 50;

    if (this.state.status == QuestionnaireResponseStatus.Processed)
      return <Typography height={height} variant='h6'>{this.state.status}</Typography>

    return (<>
      <FormControl sx={{ height: { height } }} className={"answer__status" + " " + this.GetQuestionnaireCategoryClassName(this.props.questionnaireResponse.category)} variant="standard" fullWidth>
        <Select
          labelId="demo-simple-select-standard-label"
          id="demo-simple-select-standard"
          value={this.state.status}
          label="Status"
          onChange={this.handleChange}
        >
          <MenuItem value={QuestionnaireResponseStatus.NotProcessed}>{QuestionnaireResponseStatus.NotProcessed}</MenuItem>
          <MenuItem value={QuestionnaireResponseStatus.Processed}>{QuestionnaireResponseStatus.Processed}</MenuItem>
        </Select>
      </FormControl>
    </>
    )
  }



}
