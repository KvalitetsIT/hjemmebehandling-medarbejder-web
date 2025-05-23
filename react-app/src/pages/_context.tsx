

import { createContext } from 'react';
import { FakeItToYouMakeItApi } from '../apis/FakeItToYouMakeItApi';
import CareplanService from '../services/CareplanService';
import { ICareplanService } from '../services/interfaces/ICareplanService';
import { IQuestionAnswerService } from '../services/interfaces/IQuestionAnswerService';
import { IQuestionnaireService } from '../services/interfaces/IQuestionnaireService';
import { IPatientService } from '../services/interfaces/IPatientService';

import QuestionAnswerService from '../services/QuestionAnswerService';
import QuestionnaireService from '../services/QuestionnaireService';
import PatientService from '../services/PatientService';
import { IPersonService } from '../services/interfaces/IPersonService';
import PersonService from '../services/PersonService';
import UserService from '../services/UserService';
import { IUserService } from '../services/interfaces/IUserService';
import ValidationService from '../services/ValidationService';
import { IValidationService } from '../services/interfaces/IValidationService';
import PlanDefinitionService from '../services/PlanDefinitionService';
import { IPlanDefinitionService } from '../services/interfaces/IPlanDefinitionService';
import { CollectionHelper } from '../components/Helpers/danishImpl/CollectionHelper';
import DanishDateHelper from '../components/Helpers/danishImpl/DanishDateHelper';
import { ICollectionHelper } from '../components/Helpers/interfaces/ICollectionHelper';
import IDateHelper from '../components/Helpers/interfaces/IDateHelper';

/**
 * 
 */
export interface IApiContext {
    questionnaireService: IQuestionnaireService
    questionAnswerService: IQuestionAnswerService
    careplanService: ICareplanService,
    patientService: IPatientService,
    personService: IPersonService,
    userService: IUserService,
    validationService: IValidationService,
    planDefinitionService: IPlanDefinitionService,

    dateHelper: IDateHelper
    collectionHelper: ICollectionHelper
}

const ApiContext = createContext<IApiContext>(
    {
        questionnaireService: new QuestionnaireService(new FakeItToYouMakeItApi()),
        questionAnswerService: new QuestionAnswerService(new FakeItToYouMakeItApi()),
        careplanService: new CareplanService(new FakeItToYouMakeItApi()),
        patientService: new PatientService(new FakeItToYouMakeItApi()),
        userService: new UserService(new FakeItToYouMakeItApi()),
        personService: new PersonService(new FakeItToYouMakeItApi()),
        validationService: new ValidationService(),
        planDefinitionService: new PlanDefinitionService(new FakeItToYouMakeItApi()),

        dateHelper: new DanishDateHelper(),
        collectionHelper: new CollectionHelper()
    }
); //Default value

export default ApiContext;
