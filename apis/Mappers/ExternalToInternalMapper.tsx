
import { Address } from "../../components/Models/Address";
import { Answer, NumberAnswer, StringAnswer } from "../../components/Models/Answer";
import { CategoryEnum } from "../../components/Models/CategoryEnum";
import { Contact } from "../../components/Models/Contact";
import { DayEnum, Frequency, FrequencyEnum } from "../../components/Models/Frequency";
import { PatientCareplan } from "../../components/Models/PatientCareplan";
import { PatientDetail } from "../../components/Models/PatientDetail";
import { Person } from "../../components/Models/Person";
import PersonContact from "../../components/Models/PersonContact";
import { PlanDefinition } from "../../components/Models/PlanDefinition";
import { Question, QuestionTypeEnum } from "../../components/Models/Question";
import { Questionnaire } from "../../components/Models/Questionnaire";
import { QuestionnaireResponse, QuestionnaireResponseStatus } from "../../components/Models/QuestionnaireResponse";
import { Task } from "../../components/Models/Task";
import { ThresholdCollection } from "../../components/Models/ThresholdCollection";
import { User } from "../../components/Models/User";
import { AnswerDto, CarePlanDto, ContactDetailsDto, FrequencyDto, FrequencyDtoWeekdaysEnum, PartialUpdateQuestionnaireResponseRequestExaminationStatusEnum, PatientDto, PersonDto, PlanDefinitionDto, QuestionDto, QuestionDtoQuestionTypeEnum, QuestionnaireResponseDto, QuestionnaireResponseDtoExaminationStatusEnum, QuestionnaireResponseDtoTriagingCategoryEnum, QuestionnaireWrapperDto, ThresholdDto, ThresholdDtoTypeEnum, UserContext } from "../../generated/models";
import FhirUtils from "../../util/FhirUtils";
import BaseMapper from "./BaseMapper";


/**
 * This class maps from the external models (used in bff-api) to the internal models (used in frontend)
 */
export default class ExternalToInternalMapper extends BaseMapper{
    mapCarePlanDto(carePlanDto: CarePlanDto) : PatientCareplan {

            let carePlan = new PatientCareplan();
    
            carePlan.id = FhirUtils.unqualifyId(carePlanDto.id);
            carePlan.planDefinitions = carePlanDto.planDefinitions!.map(pd => this.mapPlanDefinitionDto(pd))
            carePlan.questionnaires = carePlanDto?.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
            carePlan.patient = this.mapPatientDto(carePlanDto.patientDto!);
            carePlan.creationDate = new Date(); // TODO - include creation and termination date in the response ...
            //carePlan.terminationDate = undefined; // TODO
            carePlan.department = "Umuliologisk Afdeling"; // TODO - include Department in the api response ...
    
            return carePlan;

    }

    buildTaskFromCarePlan(carePlan: CarePlanDto) : Task {
    
            let task = new Task()

            task.cpr = carePlan.patientDto!.cpr!
            task.category = CategoryEnum.BLUE
            task.firstname = carePlan.patientDto!.givenName
            task.lastname = carePlan.patientDto!.familyName
            task.questionnaireResponseStatus = undefined
            task.carePlanId = carePlan.id

            var questionnaire = carePlan.questionnaires![0].questionnaire!
            task.questionnaireId = questionnaire.id!
            task.questionnaireName = questionnaire.title!

            task.answeredTime = undefined
            task.responseLinkEnabled = false

            return task
    }

    mapPlanDefinitionDto(planDefinitionDto: PlanDefinitionDto) : PlanDefinition {
     
            let planDefinition = new PlanDefinition()
    
            planDefinition.id = planDefinitionDto.id!
            planDefinition.name = planDefinitionDto.title ?? "Titel mangler";
            planDefinition.questionnaires = planDefinitionDto.questionnaires?.map(q => this.mapQuestionnaireDto(q)) ?? []
    
            return planDefinition

    }

    mapThresholdDtos(thresholdDtos: Array<ThresholdDto>) : Array<ThresholdCollection> {
  
            console.log(thresholdDtos)
            let thresholds: ThresholdCollection[] = [];
            
            
            for(var thresholdDto of thresholdDtos) {
                let threshold = thresholds.find(x=>x.questionId == thresholdDto.questionId);
                if (threshold === undefined) {
                    threshold = new ThresholdCollection();
                    threshold.questionId = thresholdDto.questionId!;
                    thresholds.push(threshold);
                }
                
                if (!(thresholdDto.valueBoolean === undefined)) {
                    console.log(threshold.questionId +"=thresholdOption")
                    let thresholdOption = this.CreateOption(
                        thresholdDto.questionId!,
                        String(thresholdDto.valueBoolean!),
                        this.mapTresholdCategory(thresholdDto.type!)
                    );
                    threshold.thresholdOptions!.push(thresholdOption);
                }
                else {
                    console.log(threshold.questionId +"=thresholdNumber")
                    let thresholdNumber = this.CreateThresholdNumber(
                        thresholdDto.questionId!,
                        Number(thresholdDto.valueQuantityLow),
                        Number(thresholdDto.valueQuantityHigh),
                        this.mapTresholdCategory(thresholdDto.type!)
                    );
                    threshold.thresholdNumbers!.push(thresholdNumber);
                }
            }
            console.log(thresholds)
            return thresholds;

    }
    mapWeekdayDto(weekdays: FrequencyDtoWeekdaysEnum[]) : DayEnum[] {
        let dayEnums : DayEnum[] = [];
        for(var weekday of weekdays) {
            dayEnums.push( this.mapFrequencyDtoWeekdaysEnum(weekday) );
        }
        return dayEnums;
    }


    mapQuestionDto(questionDto: QuestionDto) : Question {
        let question = new Question();
        question.Id = questionDto.linkId!;
        
        switch(questionDto.questionType){
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
        // TODO - handle options properly (there must be at least one option for the answer table to render).
        //TODO: question.options = [this.CreateOption("1", "placeholder", CategoryEnum.YELLOW)]

        return question;
    }

    mapTriagingCategory(category: QuestionnaireResponseDtoTriagingCategoryEnum) : CategoryEnum {
        switch(category) {
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

    mapTresholdCategory(category: ThresholdDtoTypeEnum) : CategoryEnum {
        switch(category) {
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

    mapFrequencyDtoWeekdaysEnum(weekday: FrequencyDtoWeekdaysEnum) : DayEnum {
        switch(weekday) {
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
        internalUser.entitlements = user.entitlements;
        internalUser.firstName = user.firstName;
        internalUser.fullName = user.fullName;
        internalUser.lastName = user.lastName;
        internalUser.orgId = user.orgId;
        internalUser.orgName = user.orgName;
        internalUser.userId = user.userId!;
        
        return internalUser;
    }

    mapExaminationStatus(status: QuestionnaireResponseDtoExaminationStatusEnum) : QuestionnaireResponseStatus {
        switch(status) {
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

    mapAnswerDto(answerDto: AnswerDto) : Answer {
        let answer: Answer = new StringAnswer();

        let value = answerDto.value!
        if(Number.parseFloat(value)) {
            let numberAnswer = new NumberAnswer()
            numberAnswer.answer = Number.parseFloat(value)
            answer = numberAnswer
        }
        else {
            let stringAnswer = new StringAnswer()
            stringAnswer.answer = value
            answer = stringAnswer
        }

        return answer;
    }

    mapQuestionnaireResponseDto(questionnaireResponseDto: QuestionnaireResponseDto) : QuestionnaireResponse {
        let response = new QuestionnaireResponse();
        //let response = this.getQuestionnaireResponse();
        response.id = questionnaireResponseDto.id!;
        response.questions = new Map<Question, Answer>();

        for(var pair of questionnaireResponseDto.questionAnswerPairs!) {
            var question = this.mapQuestionDto(pair.question!);
            var answer = this.mapAnswerDto(pair.answer!);
            response.questions.set(question, answer);
        }

        response.answeredTime = questionnaireResponseDto.answered;
        response.status = this.mapExaminationStatus(questionnaireResponseDto.examinationStatus!);
        if(questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Red){
	        response.category = CategoryEnum.RED; 
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Yellow){
	        response.category = CategoryEnum.YELLOW; 	
        } else if (questionnaireResponseDto.triagingCategory === QuestionnaireResponseDtoTriagingCategoryEnum.Green){
	        response.category = CategoryEnum.GREEN; 	
        } else {
		    response.category = CategoryEnum.BLUE; 
        }
        response.patient = this.mapPatientDto(questionnaireResponseDto.patient!);

        return response;
    }
    mapFrequencyDto(frequencyDto: FrequencyDto) : Frequency {
   
            let frequency = new Frequency();
    
            frequency.repeated = FrequencyEnum.WEEKLY
            frequency.days = this.mapWeekdayDto(frequencyDto.weekdays!)
            frequency.deadline = frequencyDto.timeOfDay!
    
            return frequency;

    }

    mapQuestionnaireDto(wrapper: QuestionnaireWrapperDto) : Questionnaire {
      
            let questionnaire = new Questionnaire();
    
            questionnaire.id = FhirUtils.unqualifyId(wrapper.questionnaire!.id!)
            questionnaire.name = wrapper.questionnaire!.title!;
            questionnaire.frequency = this.mapFrequencyDto(wrapper.frequency!);
            questionnaire.thresholds = this.mapThresholdDtos(wrapper.thresholds!);
    
            return questionnaire;
    }

    mapContactDetailsDto(patientContactDetails: ContactDetailsDto) : Contact {
       
            let contact = new Contact();
    
            let address = new Address();
            console.log('ContactDetails: ' + JSON.stringify(patientContactDetails));
            address.street = patientContactDetails?.street ?? 'Fiskergade 66';
            address.zipCode = patientContactDetails?.postalCode ?? '8000';
            address.city = "Aarhus";
            address.country = patientContactDetails?.country ?? 'Danmark';
    
            contact.primaryPhone = patientContactDetails?.primaryPhone ?? "12345678";
            contact.secondaryPhone = patientContactDetails?.secondaryPhone ?? "87654321";
    
            return contact;
    }

    mapPatientDto(patientDto: PatientDto) : PatientDetail {
       
            let patient = new PatientDetail();
    
            patient.firstname = patientDto.givenName;
            patient.lastname = patientDto.familyName;
            patient.cpr = patientDto.cpr;
            //TODO : patient.patientContact = this.mapContactDetailsDto(patientDto.patientContactDetails!);
            patient.contact = this.mapContactDetailsDto(patientDto.primaryRelativeContactDetails!)
            // TODO - map additional contact details.
    
            return patient;

    }
}