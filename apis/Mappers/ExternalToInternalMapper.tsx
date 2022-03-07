
import { Address } from "@kvalitetsit/hjemmebehandling/Models/Address";
import { Answer, BooleanAnswer, NumberAnswer, StringAnswer } from "@kvalitetsit/hjemmebehandling/Models/Answer";
import { CategoryEnum } from "@kvalitetsit/hjemmebehandling/Models/CategoryEnum";
import { Contact } from "@kvalitetsit/hjemmebehandling/Models/Contact";
import { EnableWhen } from "@kvalitetsit/hjemmebehandling/Models/EnableWhen";
import { DayEnum, Frequency, FrequencyEnum } from "@kvalitetsit/hjemmebehandling/Models/Frequency";
import { MeasurementType } from "@kvalitetsit/hjemmebehandling/Models/MeasurementType";
import { PatientCareplan } from "@kvalitetsit/hjemmebehandling/Models/PatientCareplan";
import { PatientDetail } from "@kvalitetsit/hjemmebehandling/Models/PatientDetail";
import { Person } from "@kvalitetsit/hjemmebehandling/Models/Person";
import PersonContact from "@kvalitetsit/hjemmebehandling/Models/PersonContact";
import { PlanDefinition } from "@kvalitetsit/hjemmebehandling/Models/PlanDefinition";
import { BaseQuestion, CallToActionQuestion, Question, QuestionTypeEnum } from "@kvalitetsit/hjemmebehandling/Models/Question";
import { Questionnaire } from "@kvalitetsit/hjemmebehandling/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "@kvalitetsit/hjemmebehandling/Models/QuestionnaireResponse";
import SimpleOrganization from "@kvalitetsit/hjemmebehandling/Models/SimpleOrganization";
import { Task } from "@kvalitetsit/hjemmebehandling/Models/Task";
import { ThresholdCollection } from "@kvalitetsit/hjemmebehandling/Models/ThresholdCollection";
import { User } from "@kvalitetsit/hjemmebehandling/Models/User";
import { AnswerDto, AnswerDtoAnswerTypeEnum, CarePlanDto, ContactDetailsDto, EnableWhen as EnableWhenDto, FrequencyDto, FrequencyDtoWeekdaysEnum, PatientDto, PersonDto, PlanDefinitionDto, QuestionDto, QuestionDtoQuestionTypeEnum, QuestionnaireDto, QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum, QuestionnaireWrapperDto, ThresholdDto, ThresholdDtoTypeEnum, UserContext } from "../../generated/models";
import { MeasurementTypeDto } from "../../generated/models/MeasurementTypeDto";
import FhirUtils from "../../util/FhirUtils";
import BaseMapper from "./BaseMapper";


/**
 * This class maps from the external models (used in bff-api) to the internal models (used in frontend)
 */
export default class ExternalToInternalMapper extends BaseMapper {
    mapMeasurementType(mt: MeasurementTypeDto): MeasurementType {
        const toReturn = new MeasurementType();
        toReturn.displayName = mt.display
        toReturn.code = mt.code
        toReturn.system = mt.system
        return toReturn;
    }

    mapCarePlanDto(carePlanDto: CarePlanDto): PatientCareplan {
        const carePlan = new PatientCareplan()

        carePlan.id = FhirUtils.unqualifyId(carePlanDto.id)
        carePlan.planDefinitions = carePlanDto.planDefinitions!.map(pd => this.mapPlanDefinitionDto(pd))
        carePlan.questionnaires = carePlanDto?.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
        carePlan.patient = this.mapPatientDto(carePlanDto.patientDto!)
        if (!carePlanDto.created) {
            throw new Error('No creation date on careplan!')
        }
        carePlan.creationDate = carePlanDto.created
        carePlan.terminationDate = carePlanDto.endDate
        carePlan.organization = new SimpleOrganization();
        carePlan.organization.name = carePlanDto?.departmentName ?? 'Ukendt afdeling   '

        return carePlan
    }

    buildTaskFromCarePlan(carePlan: CarePlanDto): Task {
        const task = new Task()

        task.cpr = carePlan.patientDto!.cpr!

        let planDefinitionName = 'PATIENTGRUPPE MANGLER'
        if (carePlan.planDefinitions && carePlan.planDefinitions.length === 1 && carePlan.planDefinitions![0].title) {
            planDefinitionName = carePlan.planDefinitions![0].title
        }
        task.planDefinitionName = planDefinitionName
        task.category = CategoryEnum.BLUE
        task.firstname = carePlan.patientDto!.givenName
        task.lastname = carePlan.patientDto!.familyName
        task.questionnaireResponseStatus = undefined
        task.carePlanId = carePlan.id

        const questionnaire = carePlan.questionnaires![0].questionnaire!
        task.questionnaireId = questionnaire.id!
        task.questionnaireName = questionnaire.title!

        task.answeredTime = undefined
        task.responseLinkEnabled = false

        return task
    }

    buildTaskFromQuestionnaireResponse(questionnaireResponse: QuestionnaireResponseDto): Task {
        const task = new Task()

        task.cpr = questionnaireResponse.patient!.cpr!
        task.category = this.mapTriagingCategory(questionnaireResponse.triagingCategory!)
        task.firstname = questionnaireResponse.patient!.givenName
        task.lastname = questionnaireResponse.patient!.familyName
        task.questionnaireResponseStatus = this.mapExaminationStatus(questionnaireResponse.examinationStatus!)
        task.questionnaireId = questionnaireResponse.questionnaireId!
        task.questionnaireName = questionnaireResponse.questionnaireName!
        task.answeredTime = questionnaireResponse.answered!
        task.responseLinkEnabled = true
        task.planDefinitionName = questionnaireResponse.planDefinitionTitle ?? 'PATIENTGRUPPE MANGLER'

        return task
    }

    mapPlanDefinitionDto(planDefinitionDto: PlanDefinitionDto): PlanDefinition {

        const planDefinition = new PlanDefinition()

        planDefinition.id = FhirUtils.unqualifyId(planDefinitionDto.id!);
        planDefinition.name = planDefinitionDto.title ?? "Titel mangler";
        planDefinition.questionnaires = planDefinitionDto.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
        planDefinition.status = planDefinitionDto.status
        planDefinition.created = planDefinitionDto.created
        return planDefinition

    }

    mapThresholdDtos(thresholdDtos: Array<ThresholdDto>): Array<ThresholdCollection> {

        const thresholds: ThresholdCollection[] = [];


        for (const thresholdDto of thresholdDtos) {
            let threshold = thresholds.find(x => x.questionId == thresholdDto.questionId);
            if (threshold === undefined) {
                threshold = new ThresholdCollection();
                threshold.questionId = thresholdDto.questionId!;
                thresholds.push(threshold);
            }

            if (!(thresholdDto.valueBoolean === undefined)) {
                const thresholdOption = this.CreateOption(
                    thresholdDto.questionId!,
                    String(thresholdDto.valueBoolean!),
                    this.mapTresholdCategory(thresholdDto.type!)
                );
                threshold.thresholdOptions!.push(thresholdOption);
            }
            else {
                const thresholdNumber = this.CreateThresholdNumber(
                    thresholdDto.questionId!,
                    Number(thresholdDto.valueQuantityLow),
                    Number(thresholdDto.valueQuantityHigh),
                    this.mapTresholdCategory(thresholdDto.type!)
                );
                threshold.thresholdNumbers!.push(thresholdNumber);
            }
        }
        return thresholds;

    }
    mapWeekdayDto(weekdays: FrequencyDtoWeekdaysEnum[]): DayEnum[] {
        const dayEnums: DayEnum[] = [];
        for (const weekday of weekdays) {
            dayEnums.push(this.mapFrequencyDtoWeekdaysEnum(weekday));
        }
        return dayEnums;
    }

    mapCallToAction(questionDto: QuestionDto): CallToActionQuestion {
        const callToAction = new CallToActionQuestion();
        callToAction.Id = questionDto.linkId!;


        callToAction.message = questionDto.text!
        callToAction.enableWhens = questionDto.enableWhen?.map(ew => this.mapEnableWhenDto(ew)) as EnableWhen<boolean>[] ?? [];
        return callToAction;
    }

    mapQuestionDto(questionDto: QuestionDto): Question {
        const question = new Question();
        question.Id = questionDto.linkId!;
        question.abbreviation = questionDto.linkId
        switch (questionDto.questionType) {
            case QuestionDtoQuestionTypeEnum.Boolean:
                question.type = QuestionTypeEnum.BOOLEAN;
                break;
            case QuestionDtoQuestionTypeEnum.Choice:
                question.type = QuestionTypeEnum.CHOICE;
                break;
            case QuestionDtoQuestionTypeEnum.Integer:
                question.type = QuestionTypeEnum.INTEGER;
                break;
            case QuestionDtoQuestionTypeEnum.Quantity:
                question.type = QuestionTypeEnum.OBSERVATION;
                break;
            case QuestionDtoQuestionTypeEnum.String:
                question.type = QuestionTypeEnum.STRING;
                break;
        }

        question.question = questionDto.text!
        question.enableWhen = this.mapEnableWhenDto(questionDto.enableWhen?.find(() => true));
        // TODO - handle options properly (there must be at least one option for the answer table to render).
        // TODO: question.options = [this.CreateOption("1", "placeholder", CategoryEnum.YELLOW)]

        return question;
    }
    mapEnableWhenDto(enableWhenDto: EnableWhenDto | undefined): EnableWhen<boolean> | undefined {
        if (!enableWhenDto)
            return undefined;

        const toReturn = new EnableWhen<boolean>();
        toReturn.answer = enableWhenDto.answer?.value == "true"
        toReturn.questionId = enableWhenDto.answer?.linkId ?? ""
        return toReturn;

    }

    mapTriagingCategory(category: QuestionnaireResponseDtoTriagingCategoryEnum): CategoryEnum {
        switch (category) {
            case QuestionnaireResponseDtoTriagingCategoryEnum.Green:
                return CategoryEnum.GREEN
            case QuestionnaireResponseDtoTriagingCategoryEnum.Yellow:
                return CategoryEnum.YELLOW
            case QuestionnaireResponseDtoTriagingCategoryEnum.Red:
                return CategoryEnum.RED
            default:
                throw new Error('Could not map category ' + category);
        }
    }

    mapTresholdCategory(category: ThresholdDtoTypeEnum): CategoryEnum {
        switch (category) {
            case ThresholdDtoTypeEnum.Normal:
                return CategoryEnum.GREEN
            case ThresholdDtoTypeEnum.Abnormal:
                return CategoryEnum.YELLOW
            case ThresholdDtoTypeEnum.Critical:
                return CategoryEnum.RED
            default:
                throw new Error('Could not map category ' + category);
        }
    }

    mapFrequencyDtoWeekdaysEnum(weekday: FrequencyDtoWeekdaysEnum): DayEnum {
        switch (weekday) {
            case FrequencyDtoWeekdaysEnum.Mon:
                return DayEnum.Monday;
            case FrequencyDtoWeekdaysEnum.Tue:
                return DayEnum.Tuesday;
            case FrequencyDtoWeekdaysEnum.Wed:
                return DayEnum.Wednesday;
            case FrequencyDtoWeekdaysEnum.Thu:
                return DayEnum.Thursday;
            case FrequencyDtoWeekdaysEnum.Fri:
                return DayEnum.Friday;
            case FrequencyDtoWeekdaysEnum.Sat:
                return DayEnum.Saturday;
            case FrequencyDtoWeekdaysEnum.Sun:
                return DayEnum.Sunday;

            default:
                throw new Error('Could not map category ' + weekday);
        }
    }
    mapUserFromExternalToInternal(user: UserContext): User {
        const internalUser = new User();
        internalUser.autorisationsids = user.autorisationsids;
        internalUser.email = user.email;
        internalUser.entitlements = user.entitlements?.map(e => this.mapSingleEntitlement(e)).filter(e => e != undefined);
        internalUser.firstName = user.firstName;
        internalUser.fullName = user.fullName;
        internalUser.lastName = user.lastName;
        internalUser.orgId = user.orgId;
        internalUser.orgName = user.orgName;
        internalUser.userId = user.userId!;

        return internalUser;
    }

    mapSingleEntitlement(entitlement: string): string {
        const splittedByUnderscore = entitlement.split("_");
        const lenght = splittedByUnderscore.length
        const mappedEntitlement = splittedByUnderscore[lenght - 1]
        return mappedEntitlement;
    }

    mapExaminationStatus(status: QuestionnaireResponseDtoExaminationStatusEnum): QuestionnaireResponseStatus {
        switch (status) {
            case QuestionnaireResponseDtoExaminationStatusEnum.NotExamined:
                return QuestionnaireResponseStatus.NotProcessed
            case QuestionnaireResponseDtoExaminationStatusEnum.UnderExamination:
                return QuestionnaireResponseStatus.InProgress
            case QuestionnaireResponseDtoExaminationStatusEnum.Examined:
                return QuestionnaireResponseStatus.Processed
            default:
                throw new Error('Could not map ExaminationStatus ' + status)
        }
    }

    mapPersonFromExternalToInternal(person: PersonDto): Person {
        const internalPerson = new Person();
        internalPerson.birthDate = person.birthDate;
        internalPerson.cpr = person.cpr!;
        internalPerson.deceasedBoolean = person.deceasedBoolean;
        internalPerson.familyName = person.familyName;
        internalPerson.gender = person.gender;
        internalPerson.givenName = person.givenName;
        internalPerson.patientContactDetails = this.mapPersonContactFromExternalToInternal(person.patientContactDetails);
        return internalPerson;
    }
    mapPersonContactFromExternalToInternal(externalPersonContact: ContactDetailsDto | undefined): PersonContact {
        const internalPersonContact = new PersonContact();
        internalPersonContact.city = externalPersonContact?.city;
        internalPersonContact.country = externalPersonContact?.country;
        internalPersonContact.postalCode = externalPersonContact?.postalCode;
        internalPersonContact.primaryPhone = externalPersonContact?.primaryPhone;
        internalPersonContact.secondaryPhone = externalPersonContact?.secondaryPhone;
        internalPersonContact.street = externalPersonContact?.street;

        return internalPersonContact;
    }

    mapAnswerDto(answerDto: AnswerDto): Answer {

        switch (answerDto.answerType) {
            case AnswerDtoAnswerTypeEnum.Integer:
                return this.mapNumberedAnswer(answerDto);
            case AnswerDtoAnswerTypeEnum.Quantity:
                return this.mapNumberedAnswer(answerDto);
            case AnswerDtoAnswerTypeEnum.Boolean:
                return this.mapBooleanAnswer(answerDto);
            default:
                return this.mapStringAnswer(answerDto); //Treat as string as default
        }


    }

    mapStringAnswer(answerDto: AnswerDto): StringAnswer {
        const toReturn = new StringAnswer();
        toReturn.answer = answerDto.value!
        return toReturn;
    }

    mapNumberedAnswer(answerDto: AnswerDto): NumberAnswer {
        const toReturn = new NumberAnswer();
        toReturn.answer = Number.parseFloat(answerDto.value!)
        return toReturn;
    }

    mapBooleanAnswer(answerDto: AnswerDto): BooleanAnswer {
        const toReturn = new BooleanAnswer();
        const answerValue = answerDto.value?.toLowerCase()

        const isTrueOrFalse = answerValue == "true" || answerValue == "false"
        if (isTrueOrFalse) {
            toReturn.answer = answerValue == "true"
            return toReturn;
        }

        throw new Error("Answer in AnswerDto was not a boolean")
    }

    mapQuestionnaireResponseDto(questionnaireResponseDto: QuestionnaireResponseDto): QuestionnaireResponse {
        const response = new QuestionnaireResponse();
        //const response = this.getQuestionnaireResponse();
        response.id = questionnaireResponseDto.id!;
        response.questions = new Map<Question, Answer>();

        for (const pair of questionnaireResponseDto.questionAnswerPairs!) {
            const question = this.mapQuestionDto(pair.question!);
            const answer = this.mapAnswerDto(pair.answer!);
            response.questions.set(question, answer);
        }

        response.answeredTime = questionnaireResponseDto.answered;
        response.status = this.mapExaminationStatus(questionnaireResponseDto.examinationStatus!);
        if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Red) {
            response.category = CategoryEnum.RED;
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Yellow) {
            response.category = CategoryEnum.YELLOW;
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Green) {
            response.category = CategoryEnum.GREEN;
        } else {
            response.category = CategoryEnum.BLUE;
        }
        response.patient = this.mapPatientDto(questionnaireResponseDto.patient!);
        response.questionnaireId = FhirUtils.unqualifyId(questionnaireResponseDto.questionnaireId!)

        return response;
    }
    mapFrequencyDto(frequencyDto: FrequencyDto): Frequency {

        const frequency = new Frequency();

        frequency.repeated = FrequencyEnum.WEEKLY
        frequency.days = this.mapWeekdayDto(frequencyDto.weekdays!)
        frequency.deadline = frequencyDto.timeOfDay!

        return frequency;

    }

    mapQuestionnaireDto(wrapper: QuestionnaireWrapperDto): Questionnaire {
        const questionnaire = this.mapQuestionnaire(wrapper!.questionnaire!);
        questionnaire.frequency = this.mapFrequencyDto(wrapper.frequency!);
        questionnaire.thresholds = this.mapThresholdDtos(wrapper.thresholds!);
        return questionnaire;
    }

    mapQuestionnaire(questionnaire: QuestionnaireDto): Questionnaire {
        const questionnaireResult = new Questionnaire();

        questionnaireResult.id = FhirUtils.unqualifyId(questionnaire!.id!)
        questionnaireResult.name = questionnaire!.title!;
        questionnaireResult.lastUpdated = questionnaire.lastUpdated;
        questionnaireResult.status = questionnaire?.status;
        questionnaireResult.questions = questionnaire.questions?.map(q => this.mapQuestionDto(q))
        const callToActions: BaseQuestion[] = questionnaire.callToActions!.map(x => this.mapCallToAction(x));
        questionnaireResult.questions?.push(...callToActions);
        questionnaireResult.version = questionnaire?.version;
        return questionnaireResult;
    }

    mapPatientDto(patientDto: PatientDto): PatientDetail {
        let address: Address = {}
        if (patientDto.patientContactDetails) {
            address = this.buildAddress(patientDto.patientContactDetails)
        }


        const contactDetails = this.buildContactDetails(patientDto)

        const toReturn = new PatientDetail();
        toReturn.firstname = patientDto.givenName;
        toReturn.lastname = patientDto.familyName;
        toReturn.cpr = patientDto.cpr;
        toReturn.primaryPhone = patientDto.patientContactDetails?.primaryPhone
        toReturn.secondaryPhone = patientDto.patientContactDetails?.secondaryPhone
        toReturn.address = address
        toReturn.contact = contactDetails
        toReturn.username = patientDto.customUserName
        return toReturn;
    }

    buildContactDetails(patientDto: PatientDto): Contact {
        const toReturn = new Contact();

        toReturn.fullname = patientDto?.primaryRelativeName ?? ''
        toReturn.affiliation = patientDto?.primaryRelativeAffiliation ?? ''
        toReturn.primaryPhone = patientDto?.primaryRelativeContactDetails?.primaryPhone ?? ''
        toReturn.secondaryPhone = patientDto?.primaryRelativeContactDetails?.secondaryPhone ?? ''
        return toReturn;

    }

    buildAddress(contactDetails: ContactDetailsDto): Address {
        const address = new Address();

        address.city = contactDetails?.city;
        address.country = contactDetails?.country;
        address.zipCode = contactDetails?.postalCode;
        address.street = contactDetails?.street;

        return address;
    }
}