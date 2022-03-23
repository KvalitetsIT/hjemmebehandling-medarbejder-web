import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { QuestionnaireResponse, QuestionnaireResponseStatus } from '@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse';
import { Component } from 'react';
import ApiContext from '../../pages/_context';
import { IQuestionnaireService } from '../../services/interfaces/IQuestionnaireService';
import { CategoryEnum } from '@kvalitetsit/hjemmebehandling/Models/CategoryEnum';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Typography } from '@mui/material';
import { CreateToastEvent, CreateToastEventData } from '@kvalitetsit/hjemmebehandling/Events/CreateToastEvent';
import { LoadingButton } from '@mui/lab';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

export interface Props {
  questionnaireResponse: QuestionnaireResponse
  onUpdate: (newStatus: QuestionnaireResponseStatus) => void;
}

export interface State {
  status?: QuestionnaireResponseStatus;
  openConfirmationBox: boolean;
  changingState: boolean;
  desiredStatus: QuestionnaireResponseStatus;
}

export class QuestionnaireResponseStatusSelect extends Component<Props, State> {
  static displayName = QuestionnaireResponseStatusSelect.name;
  static contextType = ApiContext
  questionnaireService!: IQuestionnaireService

  constructor(props: Props) {
    super(props);
    this.state = {
      status: props.questionnaireResponse.status,
      openConfirmationBox: false,
      changingState: false,
      desiredStatus: props.questionnaireResponse.status
    }
  }

  InitializeServices(): void {
    this.questionnaireService = this.context.questionnaireService;
  }

  openConfirmationBox = async (event: SelectChangeEvent): Promise<void> => {
    const collectionStatus = event.target.value as QuestionnaireResponseStatus;
    this.setState({ openConfirmationBox: true, desiredStatus: collectionStatus })
  }

  CloseVerificationBox(): void {
    this.setState({ openConfirmationBox: false })
  }

  setStatus = async (collectionStatus: QuestionnaireResponseStatus): Promise<void> => {
    const changes = new QuestionnaireResponse();
    changes.status = collectionStatus;

    this.setState({ changingState: true })

    try {
      const newStatus = await this.questionnaireService.UpdateQuestionnaireResponseStatus(this.props.questionnaireResponse.id, collectionStatus)

      new CreateToastEvent(new CreateToastEventData("Ny status: " + changes.status,"", "success")).dispatchEvent();

      this.setState({ status: newStatus })
    } catch (error: unknown) {
      this.setState(() => { throw error })
    }

    if (this.props.onUpdate)
      this.props.onUpdate(this.state.status!);

    this.setState({ changingState: false })
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
          onChange={this.openConfirmationBox}
        >
          <MenuItem value={QuestionnaireResponseStatus.NotProcessed}>{QuestionnaireResponseStatus.NotProcessed}</MenuItem>
          <MenuItem value={QuestionnaireResponseStatus.Processed}>{QuestionnaireResponseStatus.Processed}</MenuItem>
        </Select>
      </FormControl>

      <Dialog
        open={this.state.openConfirmationBox}
        onClose={() => this.CloseVerificationBox()}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Skift status?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography>Du er ved at skifte status på besvarelsen</Typography>
            <Stack direction="row">
              <Typography alignItems="center" variant='h6'>{this.state.status} </Typography>
              <ArrowRightAltIcon />
              <Typography alignItems="center" variant='h6'>{this.state.desiredStatus}</Typography>
            </Stack>

            <br />
            <Typography>Er du sikker på du vil foretage denne handling?</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button className="decline__button" onClick={() => this.CloseVerificationBox()} autoFocus>Nej</Button>
          <LoadingButton loading={this.state.changingState} className="accept__button" color="primary" variant="contained" onClick={async () => await this.setStatus(this.state.desiredStatus)} >
            Ja
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
    )
  }



}
