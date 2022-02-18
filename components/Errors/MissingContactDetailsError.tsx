import { BaseServiceError, DisplaySettings } from "@kvalitetsit/hjemmebehandling/Errorhandling/BaseServiceError";

export class MissingContactDetailsError extends BaseServiceError {


    private missingDetalis: string[]
  
    constructor(missingDetalis: string[]) {
      super();
      this.missingDetalis = missingDetalis
    }
  
    displayMessage(): string {
  
      let message: string = ""
      this.missingDetalis.forEach(x => {
        message += x + "\n"
      })
      return message;
    }
  
    displayTitle(): string {
      return this.missingDetalis.length > 0 ? "Følgende informationer mangler" : "Informationer mangler"
    }
  
    displayUrl(): string {
      return "";
    }
    displaySettings(): DisplaySettings {
      return new DisplaySettings();
    }
  }