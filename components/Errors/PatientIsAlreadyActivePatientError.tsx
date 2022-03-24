import { BaseServiceError } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";

export class PatientIsAlreadyActivePatientError extends BaseServiceError {

  constructor() {
    super();
  }

  displayMessage(): string {
    return "Patienten har allerede en aktiv monitoreringsplan"
  }

  displayTitle(): string {
    return "Patienten er allerede aktiv"
  }
}