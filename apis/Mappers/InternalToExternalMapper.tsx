import { Contact } from "../../components/Models/Contact";
import { DayEnum, Frequency } from "../../components/Models/Frequency";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";
import { CarePlanDto, ContactDetailsDto, FrequencyDto, FrequencyDtoWeekdaysEnum, PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum, PatientDto, PlanDefinitionDto, QuestionnaireWrapperDto } from "../../generated/models";
import BaseMapper from "./BaseMapper";

/**
 * This class maps from the internal models (used in frontend) to the external models (used in bff-api)
 */
export default class InternalToExternalMapper extends BaseMapper{
    mapCarePlan(carePlan: PatientCareplan) : CarePlanDto {
            let carePlanDto = {
                id: "dummy",
                title: "Ny behandlingsplan", // TODO - set a title ...
                patientDto: this.mapPatient(carePlan.patient),
                questionnaires: carePlan.questionnaires.map(q => this.mapQuestionnaire(q)),
                planDefinitions: carePlan.planDefinitions.map(pd => this.mapPlanDefinition(pd))
            }
    
            return carePlanDto

    }
    mapFrequency(frequency: Frequency) : FrequencyDto {
    
        return {
            weekdays: frequency.days.map(d => this.mapDayEnum(d)),
            timeOfDay: frequency.deadline
        }
    }

    mapDayEnum(day: DayEnum) : FrequencyDtoWeekdaysEnum {
        switch(day) {
            case DayEnum.Monday:
                return FrequencyDtoWeekdaysEnum.Mon
            case DayEnum.Tuesday:
                return FrequencyDtoWeekdaysEnum.Tue;
            case DayEnum.Wednesday:
                return FrequencyDtoWeekdaysEnum.Wed;
            case DayEnum.Thursday:
                return FrequencyDtoWeekdaysEnum.Thu;
            case DayEnum.Friday:
                return FrequencyDtoWeekdaysEnum.Fri;
            case DayEnum.Saturday:
                return FrequencyDtoWeekdaysEnum.Sat;
            case DayEnum.Sunday:
                return FrequencyDtoWeekdaysEnum.Sun;
            
            default:
                throw new Error('Could not map category ' + day);
        }
    }

    mapQuestionnaireResponseStatus(status: QuestionnaireResponseStatus) : PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum {
        switch(status) {
            case QuestionnaireResponseStatus.NotProcessed:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.NotExamined
            case QuestionnaireResponseStatus.InProgress:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.UnderExamination
            case QuestionnaireResponseStatus.Processed:
                return PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum.Examined
            default:
                throw new Error('Could not map QuestionnaireResponseStatus ' + status)
        }
    }

    mapWeekday(weekday: DayEnum) : FrequencyDtoWeekdaysEnum {
        
        return FrequencyDtoWeekdaysEnum.Mon;
        
    }

    mapContactDetails(contactDetails: Contact) : ContactDetailsDto {
       
            return {
                primaryPhone: contactDetails.primaryPhone,
                secondaryPhone: contactDetails.secondaryPhone,
            }
 
    }

    mapQuestionnaire(questionnaire: Questionnaire) : QuestionnaireWrapperDto {
      
            return { 
                questionnaire: {
                    id: questionnaire.id,
                    title: questionnaire.name
                },
                frequency: this.mapFrequency(questionnaire.frequency)
            }
       
    }

    mapPlanDefinition(planDefinition: PlanDefinition) : PlanDefinitionDto {
        
            return {
                id: planDefinition.id,
                name: planDefinition.name,
                questionnaires: planDefinition.questionnaires.map(q => this.mapQuestionnaire(q))
            }
    
    }

    mapPatient(patient: PatientDetail) : PatientDto {
            return {
                cpr: patient.cpr,
                givenName: patient.firstname,
                familyName: patient.lastname,
                patientContactDetails : new Contact()
                //TODO : patientContactDetails: this.mapContactDetails(patient),
                //TODO : primaryRelativeContactDetails: this.mapContactDetails(patient)
            }
      
    }
}