
import { Address } from "../../components/Models/Address";
import { Answer, GroupAnswer, StringAnswer, NumberAnswer, BooleanAnswer } from "../../components/Models/Answer";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { ContactDetails } from "../../components/Models/Contact";
import { EnableWhen } from "../../components/Models/EnableWhen";
import { DayEnum, Frequency, FrequencyEnum } from "../../components/Models/Frequency";
import { MeasurementType } from "../../components/Models/MeasurementType";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { Person } from "../../components/Models/Person";
import PersonContact from "../../components/Models/PersonContact";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { PrimaryContact } from "../../components/Models/PrimaryContact";
import { CallToActionQuestion, Question, QuestionTypeEnum, Option } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponseStatus, QuestionnaireResponse } from "../../components/Models/QuestionnaireResponse";
import SimpleOrganization from "../../components/Models/SimpleOrganization";
import { Task } from "../../components/Models/Task";
import { ThresholdCollection } from "../../components/Models/ThresholdCollection";
import { User } from "../../components/Models/User";
import { MeasurementTypeDto, CarePlanDto,EnableWhen as EnableWhenDto, QuestionnaireResponseDto, PlanDefinitionDto, ThresholdDto, FrequencyDtoWeekdaysEnum, QuestionDto, QuestionDtoQuestionTypeEnum, QuestionnaireResponseDtoTriagingCategoryEnum, ThresholdDtoTypeEnum, UserContext, QuestionnaireResponseDtoExaminationStatusEnum, PersonDto, ContactDetailsDto, AnswerDto, AnswerDtoAnswerTypeEnum, FrequencyDto, QuestionnaireWrapperDto, QuestionnaireDto, PatientDto } from "../../generated";
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
        carePlan.organization.name = carePlanDto?.departmentName ?? 'Ukendt afdeling'
        // carePlanDto.questionnaires?.flatMap(x => { x.thresholds })
        return carePlan
    }

    buildUnansweredTaskFromCarePlan(carePlan: CarePlanDto): Task[] {
        const now = new Date().getTime()

        const tasks: Task[] = []
        carePlan.questionnaires?.filter(q => q.satisfiedUntil && q.satisfiedUntil.getTime() < now).forEach(unsatisfiedQuestionnaire => {
            //only unsatisfied questionnaires

            carePlan.planDefinitions?.forEach(planDefinition => {
                // locate a plandefinition containing the unsatisfied questionnaire
                if (planDefinition.questionnaires?.find(q => q.questionnaire?.id === unsatisfiedQuestionnaire.questionnaire?.id)) {
                    const task = new Task()

                    task.cpr = carePlan.patientDto!.cpr!
                    task.planDefinitionName = planDefinition?.title ?? "Patientgruppe mangler"
                    task.category = CategoryEnum.BLUE
                    task.firstname = carePlan.patientDto!.givenName
                    task.lastname = carePlan.patientDto!.familyName
                    task.questionnaireResponseStatus = undefined
                    task.carePlanId = carePlan.id

                    const questionnaire = unsatisfiedQuestionnaire.questionnaire!
                    task.questionnaireId = questionnaire.id!
                    task.questionnaireName = questionnaire.title!
                    task.satisfiedUntil = unsatisfiedQuestionnaire.satisfiedUntil

                    task.answeredTime = undefined
                    task.responseLinkEnabled = false

                    //  if (task.isUnsatisfied())
                    tasks.push(task)
                }
            })
        });


        return tasks
    }

    buildAnsweredTaskFromQuestionnaireResponse(questionnaireResponse: QuestionnaireResponseDto): Task {
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
        planDefinition.status = PlanDefinition.stringToPlanDefinitionStatus(planDefinitionDto.status)
        planDefinition.created = planDefinitionDto.created
        planDefinition.lastUpdated = planDefinitionDto.lastUpdated
        return planDefinition
    }

    mapThresholdDtos(thresholdDtos: Array<ThresholdDto>): Array<ThresholdCollection> {

        const thresholds: ThresholdCollection[] = [];

        thresholdDtos.filter(thresholdDto => thresholdDto !== undefined).forEach(thresholdDto => {

            let threshold = thresholds.find(threshold => threshold.questionId === thresholdDto.questionId);

            if (!threshold) {
                threshold = new ThresholdCollection();
                threshold.questionId = thresholdDto.questionId!;
                thresholds.push(threshold);
            }

            const isValueBoolean = thresholdDto.valueBoolean !== undefined;
            if (isValueBoolean) {
                const thresholdOption = this.CreateOption(
                    thresholdDto.questionId!,
                    String(thresholdDto.valueBoolean!),
                    this.mapTresholdCategory(thresholdDto.type!)
                );
                threshold.thresholdOptions!.push(thresholdOption);
            }else if (thresholdDto.valueOption !== undefined) {
                const thresholdOptions = this.CreateOption(
                    thresholdDto.questionId!,
                    thresholdDto.valueOption,
                    this.mapTresholdCategory(thresholdDto.type!)
                )
                threshold.thresholdOptions?.push(thresholdOptions)
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
        })

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
        question.abbreviation = questionDto.abbreviation;
        question.deprecated = questionDto.deprecated!;
        question.measurementType = questionDto.measurementType ? this.mapMeasurementType(questionDto.measurementType) : undefined
        
        question.helperText = questionDto.helperText;
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
            case QuestionDtoQuestionTypeEnum.Group:
                question.type = QuestionTypeEnum.GROUP;
                question.subQuestions = questionDto.subQuestions?.map(q => this.mapQuestionDto(q))
                break;
        }
        question.options = this.mapOptions(questionDto)
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
        toReturn.answer = enableWhenDto.answer?.value === "true"
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
        internalUser.autorisationsids = user.authorizationIds;
        internalUser.email = user.email;
        internalUser.entitlements = user.entitlements?.map(e => this.mapSingleEntitlement(e)).filter(e => e !== undefined);
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

    mapAnswerDto(answerDto: AnswerDto): Answer<any> {

        switch (answerDto.answerType) {
            case AnswerDtoAnswerTypeEnum.Integer:
                return this.mapNumberedAnswer(answerDto);
            case AnswerDtoAnswerTypeEnum.Quantity:
                return this.mapNumberedAnswer(answerDto);
            case AnswerDtoAnswerTypeEnum.Boolean:
                return this.mapBooleanAnswer(answerDto);
            case AnswerDtoAnswerTypeEnum.Group:
                return this.mapGroupAnswer(answerDto);
            default:
                return this.mapStringAnswer(answerDto); //Treat as string as default
        }


    }

    mapGroupAnswer(answerDto: AnswerDto): GroupAnswer {
        if (!answerDto.linkId) throw new Error("Id is missing")

        const toReturn = new GroupAnswer(answerDto.linkId);
        toReturn.questionId = answerDto.linkId!;
        toReturn.answer = [];

        answerDto.subAnswers!.map(sa => {
            toReturn.answer?.push(this.mapAnswerDto(sa))
        })

        return toReturn;
    }
    mapStringAnswer(answerDto: AnswerDto): StringAnswer {
        if (!answerDto.linkId) throw new Error("Id is missing")

        const toReturn = new StringAnswer(answerDto.linkId);
        toReturn.questionId = answerDto.linkId!;
        toReturn.answer = answerDto.value!
        return toReturn;
    }

    mapNumberedAnswer(answerDto: AnswerDto): NumberAnswer {
        if (!answerDto.linkId) throw new Error("Id is missing")

        const toReturn = new NumberAnswer(answerDto.linkId);
        toReturn.questionId = answerDto.linkId!;
        toReturn.answer = Number.parseFloat(answerDto.value!)
        return toReturn;
    }

    mapBooleanAnswer(answerDto: AnswerDto): BooleanAnswer {
        if (!answerDto.linkId) throw new Error("Id is missing")

        const toReturn = new BooleanAnswer(answerDto.linkId);
        toReturn.questionId = answerDto.linkId!;
        const answerValue = answerDto.value?.toLowerCase()

        const isTrueOrFalse = answerValue === "true" || answerValue === "false"
        if (isTrueOrFalse) {
            toReturn.answer = answerValue === "true"
            return toReturn;
        }

        throw new Error("Answer in AnswerDto was not a boolean")
    }

    mapQuestionnaireResponseDto(questionnaireResponseDto: QuestionnaireResponseDto): QuestionnaireResponse {
        const response = new QuestionnaireResponse();
        //const response = this.getQuestionnaireResponse();
        response.id = questionnaireResponseDto.id!;
        response.questions = new Map<Question, Answer<any>>();

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
        questionnaire.frequency = wrapper.frequency !== undefined ? this.mapFrequencyDto(wrapper.frequency) : undefined;
        questionnaire.thresholds = this.mapThresholdDtos(wrapper.thresholds!);

        return questionnaire;
    }

    mapQuestionnaire(questionnaire: QuestionnaireDto): Questionnaire {
        const questionnaireResult = new Questionnaire();

        questionnaireResult.id = FhirUtils.unqualifyId(questionnaire!.id!)
        questionnaireResult.name = questionnaire!.title!;
        questionnaireResult.lastUpdated = questionnaire.lastUpdated;
        questionnaireResult.status = Questionnaire.stringToQuestionnaireStatus(questionnaire?.status)
        questionnaireResult.questions = questionnaire.questions?.map(q => this.mapQuestionDto(q))
        //const callToActions: BaseQuestion[] = questionnaire.callToActions?.map(x => this.mapCallToAction(x)) ?? [];
        questionnaireResult.questions?.push(this.mapCallToAction(questionnaire.callToAction!));
        questionnaireResult.thresholds = questionnaire.questions?.flatMap(question => this.mapThresholdDtos(question.thresholds ?? []))

        questionnaireResult.version = questionnaire?.version;
        return questionnaireResult;
    }

    mapPatientDto(patientDto: PatientDto): PatientDetail {
        let address: Address = {}
        if (patientDto.patientContactDetails) {
            address = this.buildAddress(patientDto.patientContactDetails)
        }


        const primaryContact = this.buildPrimaryContact(patientDto)

        const toReturn = new PatientDetail();
        toReturn.firstname = patientDto.givenName;
        toReturn.lastname = patientDto.familyName;
        toReturn.cpr = patientDto.cpr;

        if (!toReturn.contact) toReturn.contact = new ContactDetails()

        toReturn.contact.primaryPhone = patientDto.patientContactDetails?.primaryPhone
        toReturn.contact.secondaryPhone = patientDto.patientContactDetails?.secondaryPhone
        toReturn.contact.address = address

        toReturn.primaryContact = primaryContact
        toReturn.username = patientDto.customUserName
        return toReturn;
    }

    buildPrimaryContact(patientDto: PatientDto): PrimaryContact {
        const toReturn = new PrimaryContact();

        toReturn.fullname = patientDto?.primaryRelativeName ?? ''
        toReturn.affiliation = patientDto?.primaryRelativeAffiliation ?? ''

        let contactDetails = new ContactDetails()
        contactDetails.primaryPhone = patientDto?.primaryRelativeContactDetails?.primaryPhone ?? ''
        contactDetails.secondaryPhone = patientDto?.primaryRelativeContactDetails?.secondaryPhone ?? ''
        toReturn.contact = contactDetails

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

    mapOptions(questionDto: QuestionDto): Option[] | undefined {

        return questionDto.options?.map(option => {
            const type = questionDto.thresholds?.find(x => x.valueOption == option.option)?.type
            
            return {
                option: option.option ?? "",
                comment: option.comment ?? "",
                triage: type ? this.mapTresholdCategory(type) : CategoryEnum.BLUE
            }
        })
    }


    
}

