import { BaseServiceError } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";

export class MissingDetailsError extends BaseServiceError {


  private missingDetalis: string[]

  constructor(missingDetalis: string[]) {
    super();
    this.missingDetalis = missingDetalis
  }

  displayMessage(): string {
    return this.missingDetalis.map(x => " - " + x).join("\n")
  }

  displayTitle(): string {
    return this.missingDetalis.length > 0 ? "Følgende informationer mangler" : "Påkrævede informationer mangler"
  }
}