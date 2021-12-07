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
import { CollectionHelper } from '../globalHelpers/danishImpl/CollectionHelper';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from '../components/Layout/ErrorBoundary';

function MyApp({ Component, pageProps }: AppProps) : JSX.Element{
  const mockApi : IBackendApi = new FakeItToYouMakeItApi();
  const backendApi : IBackendApi = new BffBackendApi();
  
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
    
    <ThemeProvider theme={THEME}>
    
    <ApiContext.Provider
      value={{
        //Services
        questionnaireService : new QuestionnaireService(questionnaireBackend),
        questionAnswerService : new QuestionAnswerService(questionAnswerBackend),
        careplanService : new CareplanService(careplanBackend),
        patientService : new PatientService(patientBackend),
        userService : new UserService(userBackend),
        personService : new PersonService(personBackend),
        validationService : new ValidationService(),
        
        //Helpers
        dateHelper : new DanishDateHelper(),
        collectionHelper : new CollectionHelper()
      }}
    >
      <CssBaseline />
        {typeof window === 'undefined' ? null : 
          
              <ErrorBoundary>
          <Layout>
                <Component {...pageProps} />
            </Layout>
              </ErrorBoundary>}
        </ApiContext.Provider>
    </ThemeProvider>
    </div>
    </>
    )
  
}

const greenBg = "rgb(208,239,219)"
const greenText = "green"

const yellowBg = "rgb(253,239,208)"
const yellowText = "rgb(224,158,70)"

const redBg = "rgb(247,216,216)"
const redText = "rgb(234,124,123)"

const blueBg = "rgb(232,239,247)"
const blueText = "rgb(133,135,138)"

const mainBackground = "#F2F2F2"

const THEME = createTheme({
  typography: {
   "fontFamily": "verdana, sans-serif"
  },
  palette : {
    background : {
      default : mainBackground,
    }
  },
  components : {
    MuiAvatar : {
      styleOverrides : {
        root : {
          borderRadius : 10
        }
      }
    },
    MuiAlert : {
      styleOverrides : {
        root : {
          borderRadius : 28
        }
      }
    },
    MuiCard : {
      styleOverrides : {
        root : {
          borderRadius : 20
        }
      }
    },
    MuiChip : {
      styleOverrides : {
        root : {
          borderRadius : 28,
        },
        label : {
          padding : 0
        }
      },
      variants : [
        {
          props: { className:"round" },
          style: {
            height : 50,
            width : 50,
            borderRadius : 100,
            fontWeight : "bold",
          },
        },
        {
          props: { variant: "filled", color: "success", },
          style: {
            backgroundColor : greenBg,
            color : greenText
          },
        },
        {
          props : {variant: "filled", color : "warning"},
          style : {
            backgroundColor : yellowBg,
            color : yellowText
          }
        },
        {
          props : {variant: "filled", color : "error"},
          style : {
            backgroundColor : redBg,
            color : redText
          }
        },
        {
          props : {variant: "filled", color : "primary"},
          style : {
            backgroundColor : blueBg,
            color : blueText
          }
        }
      ]
    },
    MuiButton : {
      styleOverrides : {
        root : {
          borderRadius : 28
        }
      },
      variants : [
        {
          props : {className : "profileButton"},
          style : {
            textTransform : "none"
          }
        }
        
      ]
    }
  }
});

export default MyApp
