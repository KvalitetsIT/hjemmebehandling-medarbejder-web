import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { Contact } from "@kvalitetsit/hjemmebehandling/Models/Contact";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { DayEnum, Frequency } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { BaseQuestion, CallToActionQuestion, Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { CarePlanDto, ContactDetailsDto, FrequencyDto, FrequencyDtoWeekdaysEnum, PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum, PatientDto, PlanDefinitionDto, QuestionDto, QuestionDtoQuestionTypeEnum, QuestionnaireWrapperDto, EnableWhen as EnableWhenDto, AnswerModelAnswerTypeEnum, EnableWhenOperatorEnum, QuestionnaireDto, ThresholdDto, ThresholdDtoTypeEnum, MeasurementTypeDto } from "../../generated/models";
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
            const isBoolean = thresholdOption.option.toLowerCase() == "true" || thresholdOption.option.toLowerCase() == "false"
            if (isBoolean)
                currentThreshold.valueBoolean = thresholdOption.option.toLowerCase() == "true"

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
                questionType: this.mapQuestionType(internalQuestion.type),
                text: internalQuestion.question,
                abbreviation: internalQuestion.abbreviation,
                thresholds: this.mapThreshold(thresholdCollection),
                helperText : internalQuestion.helperText
                //measurementType: this.mapMeasurementType(internalQuestion.measurementType)
                
            }
        }

        throw new Error("InternalToExternalMapper) Question was not regular question or callToAction - What is it?")


    }
    mapMeasurementType(measurementType?: MeasurementType): MeasurementTypeDto | undefined {
        if (measurementType == undefined)
            return undefined;

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
                answerType: AnswerModelAnswerTypeEnum.Boolean,
                value: enableWhen.answer + ""
            },
            operator: EnableWhenOperatorEnum.Equal
        }
    }

    mapCarePlan(carePlan: PatientCareplan): CarePlanDto {
        const carePlanDto = {
            id: "dummy",
            title: "Ny behandlingsplan", // TODO - set a title ...
            patientDto: this.mapPatient(carePlan.patient!),
            questionnaires: carePlan.questionnaires.map(q => this.mapQuestionnaire(q)),
            planDefinitions: carePlan.planDefinitions.map(pd => this.mapPlanDefinition(pd))
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

    mapQuestionnaireResponseStatus(status: QuestionnaireResponseStatus): PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum {
        switch (status) {
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

    mapContactDetails(contactDetails: Contact): ContactDetailsDto {

        return {
            primaryPhone: contactDetails.primaryPhone,
            secondaryPhone: contactDetails.secondaryPhone,
        }

    }

    mapQuestionnaire(questionnaire: Questionnaire): QuestionnaireWrapperDto {

        return {
            questionnaire: {
                id: questionnaire.id,
                title: questionnaire.name
            },
            thresholds: questionnaire.thresholds?.flatMap(threshold => this.mapThreshold(threshold)),
            frequency: this.mapFrequency(questionnaire.frequency)
        }

    }

    mapQuestionnaireToDto(questionnaire: Questionnaire): QuestionnaireDto {

        const questions = questionnaire.getParentQuestions().concat(questionnaire.getChildQuestions())
        return {
            id: questionnaire.id,
            callToActions: questionnaire.getCallToActions().map(cta => this.mapCallToAction(cta)),
            questions: questions.map(question => this.mapQuestion(question, questionnaire.thresholds?.find(t => t.questionId == question.Id))),
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
            created: planDefinition.created
        }

    }

    mapPatient(patient: PatientDetail): PatientDto {
        const contactDetails: ContactDetailsDto = {}
        contactDetails.street = patient.address?.street
        contactDetails.postalCode = patient.address?.zipCode
        contactDetails.city = patient.address?.city
        contactDetails.primaryPhone = patient.primaryPhone
        contactDetails.secondaryPhone = patient.secondaryPhone

        let primaryRelativeContactDetails: ContactDetailsDto = {}
        if (patient.contact) {
            primaryRelativeContactDetails = {
                primaryPhone: patient?.contact.primaryPhone,
                secondaryPhone: patient?.contact.secondaryPhone
            }
        }

        return {
            givenName: patient.firstname,
            familyName: patient.lastname,
            cpr: patient.cpr,
            patientContactDetails: contactDetails,
            primaryRelativeName: patient?.contact?.fullname,
            primaryRelativeAffiliation: patient?.contact?.affiliation,
            primaryRelativeContactDetails: primaryRelativeContactDetails
        }
    }
}