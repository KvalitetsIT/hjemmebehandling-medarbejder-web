import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import ApiContext from './_context';
import { FakeItToYouMakeItApi } from '../apis/FakeItToYouMakeItApi';
import QuestionnaireService from '../services/QuestionnaireService';
import QuestionAnswerService from '../services/QuestionAnswerService';
import CareplanService from '../services/CareplanService';
import PatientService from '../services/PatientService';

import DanishDateHelper from '../globalHelpers/danishImpl/DanishDateHelper';
import PersonService from '../services/PersonService';
import { BffBackendApi } from '../apis/BffBackendApi';
import { IBackendApi } from '../apis/IBackendApi';
import React from 'react';
import UserService from '../services/UserService';
import ValidationService from '../services/ValidationService';

function MyApp({ Component, pageProps }: AppProps) : JSX.Element{
  const mockApi : IBackendApi = new FakeItToYouMakeItApi();
  const backendApi : IBackendApi =new BffBackendApi();
  
  let questionnaireBackend = backendApi
    , questionAnswerBackend = backendApi
    , careplanBackend = backendApi
    , patientBackend = backendApi
    , userBackend = backendApi
    , personBackend = backendApi
  ;

  if (process?.env.NODE_ENV === 'development') {
    if (process.env.NEXT_PUBLIC_MOCK_QUESTIONNAIRE_SERVICE === "true") {
      questionnaireBackend = mockApi;
    }
    if (process.env.NEXT_PUBLIC_MOCK_QUESTION_ANSWER_SERVICE === "true") {
      questionAnswerBackend = mockApi;
    }
    if (process.env.NEXT_PUBLIC_MOCK_CAREPLAN_SERVICE === "true") {
      careplanBackend = mockApi;
    }
    if (process.env.NEXT_PUBLIC_MOCK_PATIENT_SERVICE === "true") {
      patientBackend = mockApi;
    }
    if (process.env.NEXT_PUBLIC_MOCK_PERSON_SERVICE === "true") {
      personBackend = mockApi;
    }
    if (process.env.NEXT_PUBLIC_MOCK_USER_SERVICE === "true") {
      userBackend = mockApi;
    }
  }

  return (
    <>
    <div suppressHydrationWarning>
    <ApiContext.Provider
      value={{
        questionnaireService : new QuestionnaireService(questionnaireBackend),
        questionAnswerService : new QuestionAnswerService(questionAnswerBackend),
        careplanService : new CareplanService(careplanBackend),
        patientService : new PatientService(patientBackend),
        userService : new UserService(userBackend),
        personService : new PersonService(personBackend),
        validationService : new ValidationService(),
        dateHelper : new DanishDateHelper()
      }}
    >
        {typeof window === 'undefined' ? null : 
          <Layout>
              <Component {...pageProps} />
            </Layout>}
        </ApiContext.Provider>
    
    </div>
    </>
    )
  
}

export default MyApp
