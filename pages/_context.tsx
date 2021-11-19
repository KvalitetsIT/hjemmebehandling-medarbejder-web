

import { createContext } from 'react';
import { FakeItToYouMakeItApi } from '../apis/FakeItToYouMakeItApi';
import CareplanService from '../services/CareplanService';
import ICareplanService from '../services/interfaces/ICareplanService';
import IQuestionAnswerService from '../services/interfaces/IQuestionAnswerService';
import IQuestionnaireService from '../services/interfaces/IQuestionnaireService';
import IPatientService from '../services/interfaces/IPatientService';

import QuestionAnswerService from '../services/QuestionAnswerService';
import QuestionnaireService from '../services/QuestionnaireService';
import PatientService from '../services/PatientService';
import IDateHelper from '../globalHelpers/interfaces/IDateHelper';
import DanishDateHelper from '../globalHelpers/danishImpl/DanishDateHelper';
import IPersonService from '../services/interfaces/IPersonService';
import PersonService from '../services/PersonService';

interface IApiContext {
    questionnaireService : IQuestionnaireService
    questionAnswerService : IQuestionAnswerService
    careplanService : ICareplanService,
    patientService : IPatientService,
    personService : IPersonService,

    dateHelper : IDateHelper
}

const ApiContext = createContext<IApiContext>(
    {
        questionnaireService : new QuestionnaireService(new FakeItToYouMakeItApi()),
        questionAnswerService : new QuestionAnswerService(new FakeItToYouMakeItApi()),
        careplanService : new CareplanService(new FakeItToYouMakeItApi()),
        patientService : new PatientService(new FakeItToYouMakeItApi()),
        personService : new PersonService(new FakeItToYouMakeItApi()),
        dateHelper : new DanishDateHelper()
    }
    ); //Default value

export default ApiContext;
