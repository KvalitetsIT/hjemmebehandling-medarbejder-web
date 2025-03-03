import { BaseServiceError } from "../Errorhandling/BaseServiceError";

export class MissingContactDetailsError extends BaseServiceError {


  private missingDetalis: string[]

  constructor(missingDetalis: string[]) {
    super();
    this.missingDetalis = missingDetalis
  }

  displayMessage(): string {
    return this.missingDetalis.map(x => " - " + x).join("\n")
  }

  displayTitle(): string {
    return this.missingDetalis.length > 0 ? "Følgende informationer mangler" : "Informationer mangler"
  }
}