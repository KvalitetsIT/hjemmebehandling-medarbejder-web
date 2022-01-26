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

export interface Props {
  questionnaireResponse: QuestionnaireResponse
  onUpdate: (newStatus: QuestionnaireResponseStatus) => void;
}

export interface State {
  status?: QuestionnaireResponseStatus;

  toast?: JSX.Element;
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

    const whileUpdateIsProcessingToast = (
      <Toast snackbarTitle="Opdaterer ..." snackbarColor="info">
        Ændrer status til: {changes.status}
      </Toast>
    )
    this.setState({ status: collectionStatus, toast: whileUpdateIsProcessingToast })


    try {
      const newStatus = await this.questionnaireService.UpdateQuestionnaireResponseStatus(this.props.questionnaireResponse.id, collectionStatus)

      const afterUpdateIsCompletedToast = (
        <Toast snackbarTitle="Opdateret!" snackbarColor="success">
          Ny status: {changes.status}
        </Toast>
      )

      this.setState({ status: newStatus, toast: afterUpdateIsCompletedToast })
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

      {this.state.toast ?? <></>}
    </>
    )
  }



}
