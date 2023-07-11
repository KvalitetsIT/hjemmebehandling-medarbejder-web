import '../styles/globals.css'
import { Layout } from '../components/Layout/layout'
import ApiContext, { IApiContext } from './_context';
import { FakeItToYouMakeItApi } from '../apis/FakeItToYouMakeItApi';
import QuestionnaireService from '../services/QuestionnaireService';
import QuestionAnswerService from '../services/QuestionAnswerService';
import CareplanService from '../services/CareplanService';
import PatientService from '../services/PatientService';
import DanishDateHelper from '@kvalitetsit/hjemmebehandling/Helpers/danishImpl/DanishDateHelper';
import PersonService from '../services/PersonService';
import { BffBackendApi } from '../apis/BffBackendApi';
import { IBackendApi } from '../apis/interfaces/IBackendApi';
import React from 'react';
import UserService from '../services/UserService';
import ValidationService from '../services/ValidationService';
import { CollectionHelper } from '@kvalitetsit/hjemmebehandling/Helpers/danishImpl/CollectionHelper';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import PlanDefinitionService from '../services/PlanDefinitionService';
import { THEME } from '../styles/theme';
import getEnvironment from '../env';

export default function MyApp(): JSX.Element {

  const mockApi: IBackendApi = new FakeItToYouMakeItApi();
  const backendApi: IBackendApi = new BffBackendApi();

  let questionnaireBackend = backendApi,
    questionAnswerBackend = backendApi,
    careplanBackend = backendApi,
    patientBackend = backendApi,
    userBackend = backendApi,
    personBackend = backendApi,
    planDefinitionBackend = backendApi;

  console.log("Environment", getEnvironment())

  if (getEnvironment().REACT_APP_NODE_ENV === 'development') {
    if (getEnvironment().REACT_APP_MOCK_QUESTIONNAIRE_SERVICE === "true") {
      questionnaireBackend = mockApi;
    }
    if (getEnvironment().REACT_APP_MOCK_QUESTION_ANSWER_SERVICE === "true") {
      questionAnswerBackend = mockApi;
    }
    if (getEnvironment().REACT_APP_MOCK_CAREPLAN_SERVICE === "true") {
      careplanBackend = mockApi;
    }
    if (getEnvironment().REACT_APP_MOCK_PATIENT_SERVICE === "true") {
      patientBackend = mockApi;
    }
    if (getEnvironment().REACT_APP_MOCK_PERSON_SERVICE === "true") {
      personBackend = mockApi;
    }
    if (getEnvironment().REACT_APP_MOCK_USER_SERVICE === "true") {
      userBackend = mockApi;
    }
    if (getEnvironment().REACT_APP_MOCK_PLANDEFINITION_SERVICE === "true") {
      planDefinitionBackend = mockApi;
    }
  }
  return (
    <>
      <div suppressHydrationWarning>
        <ThemeProvider theme={THEME}>
          <ApiContext.Provider
            value={{
              //Services
              questionnaireService: new QuestionnaireService(questionnaireBackend),
              questionAnswerService: new QuestionAnswerService(questionAnswerBackend),
              careplanService: new CareplanService(careplanBackend),
              patientService: new PatientService(patientBackend),
              userService: new UserService(userBackend),
              personService: new PersonService(personBackend),
              validationService: new ValidationService(),
              planDefinitionService: new PlanDefinitionService(planDefinitionBackend),

              //Helpers
              dateHelper: new DanishDateHelper(),
              collectionHelper: new CollectionHelper()
            }}
          >
            <CssBaseline />
            {typeof window === 'undefined' ? null :
              <ErrorBoundary>
                <Layout />
              </ErrorBoundary>}
          </ApiContext.Provider>
        </ThemeProvider>
      </div>
    </>
  )

}
