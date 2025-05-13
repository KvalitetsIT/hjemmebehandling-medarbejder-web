
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { ContactDetails } from "../../components/Models/Contact";
import { EnableWhen } from "../../components/Models/EnableWhen";
import { Frequency, DayEnum } from "../../components/Models/Frequency";
import { MeasurementType } from "../../components/Models/MeasurementType";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { PrimaryContact } from "../../components/Models/PrimaryContact";
import { BaseQuestion, CallToActionQuestion, Question, QuestionTypeEnum } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";
import { ThresholdCollection } from "../../components/Models/ThresholdCollection";
import { CarePlanDto, ContactDetailsDto, FrequencyDto, FrequencyDtoWeekdaysEnum, PatientDto, PlanDefinitionDto, QuestionDto, QuestionDtoQuestionTypeEnum, QuestionnaireWrapperDto, EnableWhen as EnableWhenDto, AnswerDtoAnswerTypeEnum, EnableWhenOperatorEnum, QuestionnaireDto, ThresholdDto, ThresholdDtoTypeEnum, MeasurementTypeDto, ExaminationStatusDto } from "../../generated/models";
import FhirUtils, { Qualifier } from "../../util/FhirUtils";
import BaseMapper from "./BaseMapper";

/**
 * This class maps from the internal models (used in frontend) to the external models (used in bff-api)
 */
export default class InternalToExternalMapper extends BaseMapper {

    mapThreshold(threshold: ThresholdCollection | undefined): ThresholdDto[] {
        const toReturn: ThresholdDto[] = []

        threshold?.thresholdNumbers?.forEach(thresholdNumber => {
            const currentThreshold: ThresholdDto = {}
            currentThreshold.questionId = threshold?.questionId;
            currentThreshold.valueQuantityLow = thresholdNumber.from;
            currentThreshold.valueQuantityHigh = thresholdNumber.to;
            currentThreshold.type = this.mapCategory(thresholdNumber.category);

            toReturn.push(currentThreshold)
        })
        
        threshold?.thresholdOptions?.forEach(thresholdOption => {
            const currentThreshold: ThresholdDto = {}
            currentThreshold.questionId = threshold?.questionId;
            currentThreshold.type = this.mapCategory(thresholdOption.category);
            currentThreshold.valueOption = thresholdOption.option
            
            const isBoolean = thresholdOption.option.toLowerCase() === "true" || thresholdOption.option.toLowerCase() === "false"
            if (isBoolean)
                currentThreshold.valueBoolean = thresholdOption.option.toLowerCase() === "true"

            toReturn.push(currentThreshold)
        })
        
        return toReturn
    }



    mapCategory(category: CategoryEnum): ThresholdDtoTypeEnum | undefined {
        switch (category) {
            case CategoryEnum.GREEN:
                return ThresholdDtoTypeEnum.Normal
            case CategoryEnum.YELLOW:
                return ThresholdDtoTypeEnum.Abnormal
            case CategoryEnum.RED:
                return ThresholdDtoTypeEnum.Critical
        }

        throw new Error("Unsupported enum : " + category)
    }

    mapQuestion(internalQuestion: BaseQuestion, thresholdCollection: ThresholdCollection | undefined): QuestionDto {
        const isCallToAction = internalQuestion instanceof CallToActionQuestion;
        if (isCallToAction)
            return this.mapCallToAction(internalQuestion);


        const isRegularQuestion = internalQuestion instanceof Question
     
        if (isRegularQuestion) {
            const enableWhen: EnableWhen<boolean>[] = internalQuestion.enableWhen ? [internalQuestion.enableWhen] : []
            return {
                enableWhen: enableWhen.map(ew => this.mapEnableWhen(ew)),
                linkId: internalQuestion.Id,
                options: internalQuestion.options,
                questionType: internalQuestion.type ? this.mapQuestionType(internalQuestion.type) : undefined,
                text: internalQuestion.question,
                abbreviation: internalQuestion.abbreviation,
                measurementType: this.mapMeasurementType(internalQuestion.measurementType),
                thresholds: this.mapThreshold(thresholdCollection),
                helperText: internalQuestion.helperText,
                subQuestions: internalQuestion.subQuestions?.map(sq => this.mapQuestion(sq, undefined))
            }
        }

        throw new Error("InternalToExternalMapper) Question was not regular question or callToAction - What is it?")


    }
    mapMeasurementType(measurementType?: MeasurementType): MeasurementTypeDto {

        const toReturn: MeasurementTypeDto = {
            code: measurementType?.code,
            display: measurementType?.displayName,
            system: measurementType?.system
        }
        return toReturn;
    }
    mapQuestionType(type: QuestionTypeEnum | undefined): QuestionDtoQuestionTypeEnum | undefined {
        switch (type) {
            case QuestionTypeEnum.BOOLEAN:
                return QuestionDtoQuestionTypeEnum.Boolean
            //case QuestionTypeEnum.CALLTOACTION:
            //   return QuestionDtoQuestionTypeEnum.
            case QuestionTypeEnum.CHOICE:
                return QuestionDtoQuestionTypeEnum.Choice
            case QuestionTypeEnum.INTEGER:
                return QuestionDtoQuestionTypeEnum.Integer
            case QuestionTypeEnum.OBSERVATION:
                return QuestionDtoQuestionTypeEnum.Quantity
            case QuestionTypeEnum.STRING:
                return QuestionDtoQuestionTypeEnum.String
            case QuestionTypeEnum.GROUP:
                return QuestionDtoQuestionTypeEnum.Group
        }
        throw new Error("InternalToExternal) could not convert from " + type);
    }

    mapCallToAction(callToActionQuestion: CallToActionQuestion): QuestionDto {
        return {
            linkId: callToActionQuestion.Id,
            enableWhen: callToActionQuestion.enableWhens?.map(enableWhen => this.mapEnableWhen(enableWhen)),
            questionType: QuestionDtoQuestionTypeEnum.Display,
            text: callToActionQuestion.message
            //options : [],
            //required : false,
            //thresholds : []
        }
    }
    mapEnableWhen(enableWhen: EnableWhen<boolean>): EnableWhenDto {
        return {
            answer: {
                linkId: enableWhen.questionId,
                answerType: AnswerDtoAnswerTypeEnum.Boolean,
                value: enableWhen.answer + ""
            },
            operator: EnableWhenOperatorEnum.Equal
        }
    }

    mapCarePlan(carePlan: PatientCareplan): CarePlanDto {
        const carePlanDto: CarePlanDto = {
            id: "dummy",
            title: "Ny monitoreringsplan", // TODO - set a title ...
            patientDto: this.mapPatient(carePlan.patient!),
            questionnaires: carePlan.questionnaires.map(q => this.mapQuestionnaire(q)),
            planDefinitions: carePlan.planDefinitions.map(pd => this.mapPlanDefinition(pd)),
            created : carePlan.creationDate
        }

        return carePlanDto

    }
    mapFrequency(frequency?: Frequency): FrequencyDto {
        let toReturn: FrequencyDto = {}
        toReturn = {
            weekdays: frequency?.days?.map(d => this.mapDayEnum(d)) ?? [],
            timeOfDay: frequency?.deadline ?? "11:00" //Must not be null or empty string
        }
        return toReturn;
    }

    mapDayEnum(day: DayEnum): FrequencyDtoWeekdaysEnum {
        switch (day) {
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

    mapQuestionnaireResponseStatus(status: QuestionnaireResponseStatus): ExaminationStatusDto {
        switch (status) {
            case QuestionnaireResponseStatus.NotProcessed:
                return ExaminationStatusDto.NotExamined
            case QuestionnaireResponseStatus.InProgress:
                return ExaminationStatusDto.UnderExamination
            case QuestionnaireResponseStatus.Processed:
                return ExaminationStatusDto.Examined
            default:
                throw new Error('Could not map QuestionnaireResponseStatus ' + status)
        }
    }

    mapWeekday(weekday: DayEnum): FrequencyDtoWeekdaysEnum {
        switch (weekday) {
            case DayEnum.Monday:
                return FrequencyDtoWeekdaysEnum.Mon
            case DayEnum.Tuesday:
                return FrequencyDtoWeekdaysEnum.Tue
            case DayEnum.Wednesday:
                return FrequencyDtoWeekdaysEnum.Wed
            case DayEnum.Thursday:
                return FrequencyDtoWeekdaysEnum.Thu
            case DayEnum.Friday:
                return FrequencyDtoWeekdaysEnum.Fri
            case DayEnum.Saturday:
                return FrequencyDtoWeekdaysEnum.Sat
            case DayEnum.Sunday:
                return FrequencyDtoWeekdaysEnum.Sun
            default:
                throw new Error('Could not map DayEnum ' + weekday)

        }
    }

   
    
    mapQuestionnaire(questionnaire: Questionnaire): QuestionnaireWrapperDto {

        return {
            questionnaire: {
                id: questionnaire.id,
                title: questionnaire.name
            },
            satisfiedUntil: new Date(Date.parse("January 1, 1970")),
            thresholds: questionnaire.thresholds?.flatMap(threshold => this.mapThreshold(threshold)),
            frequency: this.mapFrequency(questionnaire.frequency)
        }

    }

    mapQuestionnaireToDto(questionnaire: Questionnaire): QuestionnaireDto {
        console.log("InternalToEcternalMapper > mapQuestionnaireToDto", questionnaire)
        const questions = questionnaire.getParentQuestions().concat(questionnaire.getChildQuestions())
        return {
            id: questionnaire.id,
            callToAction: this.mapCallToAction(questionnaire.getCallToActions()[0]),
            questions: questions.map(question => this.mapQuestion(question, questionnaire.thresholds?.find(t => t.questionId === question.Id))),
            lastUpdated: questionnaire.lastUpdated,
            status: questionnaire.status?.toString(),
            title: questionnaire.name,
            version: questionnaire.version,
            

        }

    }


    mapPlanDefinition(planDefinition: PlanDefinition): PlanDefinitionDto {

        return {
            id: FhirUtils.qualifyId(planDefinition.id!, Qualifier.PlanDefinition),
            name: planDefinition.name,
            title: planDefinition.name,
            questionnaires: planDefinition!.questionnaires!.map(q => this.mapQuestionnaire(q)),
            status: planDefinition.status?.toString(),
            created: planDefinition.created,
            lastUpdated: planDefinition.lastUpdated

        }

    }
    mapContactDetails(contact: ContactDetails) : ContactDetailsDto{
        const contactDetails: ContactDetailsDto = {}
        contactDetails.street = contact.address?.street
        contactDetails.postalCode = contact.address?.zipCode
        contactDetails.city = contact.address?.city
        contactDetails.primaryPhone = contact.primaryPhone
        contactDetails.secondaryPhone = contact.secondaryPhone
        return contactDetails
    }


    mapPatient(patient: PatientDetail): PatientDto {
    
        const primaryContact = patient!.primaryContact as PrimaryContact;

        return {
            givenName: patient.firstname,
            familyName: patient.lastname,
            cpr: patient.cpr,
            patientContactDetails: patient.contact && this.mapContactDetails(patient.contact),
            primaryRelativeName: primaryContact?.fullname,
            primaryRelativeAffiliation:primaryContact?.affiliation,
            primaryRelativeContactDetails:primaryContact?.contact && this.mapContactDetails(primaryContact?.contact) 
        }
    }
}