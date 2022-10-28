import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import ApiContext from './_context';
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
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ErrorBoundary } from '@kvalitetsit/hjemmebehandling/Errorhandling/ErrorBoundary'
import PlanDefinitionService from '../services/PlanDefinitionService';

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const mockApi: IBackendApi = new FakeItToYouMakeItApi();
  const backendApi: IBackendApi = new BffBackendApi();

  let questionnaireBackend = backendApi
    , questionAnswerBackend = backendApi
    , careplanBackend = backendApi
    , patientBackend = backendApi
    , userBackend = backendApi
    , personBackend = backendApi
    , planDefinitionBackend = backendApi
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
    if (process.env.NEXT_PUBLIC_MOCK_PLANDEFINITION_SERVICE === "true") {
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


const black = '#4a4848'

const green = '#61BD84'
const greenLight = '#D0EFDC'

const yellow = '#FFD78C'
const yellowLight = '#FFEFD0'

const red = '#EE6969'
const redLight = '#FAD8D7'

const blue = '#5D74AC'
const blueLight = '#E8EFF7'

const mainBackground = "#e8e8e8"

const THEME = createTheme({
  palette: {
    background: {
      default: mainBackground,
    },
    text: {
      primary: black
    }
  },
  typography: {
    "fontFamily": "verdana, sans-serif",
    h6: {
      fontSize: 14,
      fontWeight: "bold",
      color: black
    }
  },
  components: {
    MuiTypography: {
      variants: [
        {
          props: { className: "labelTextTab" },
          style: {
            color: black,
            textTransform: "none",
            fontWeight: "bold",
          }
        },
      ]
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: mainBackground,
          borderBottomWidth: "medium"
        }
      }
    },
    //=========== Grid ===========//
    MuiGrid: {
      styleOverrides: {
        root: {
          fontsize: 14,
          ".grid__headline": {
            paddingBottom: 10
          },
          ".grid__table": {
            paddingTop: 0
          }
        }
      },
      variants: [
        {
          props: { className: 'thumbnail__icon' },
          style: {
            borderRadius: 10,
            flexBasis: 'initial',
            width: 80,
            height: 80
          }
        },
        {
          props: { className: 'focusedParentQuestionEditCard' },

          style: {
            backgroundColor: blue, //"white"
            "button": {
              color: "white"
            }
          }
        },
        {
          props: { className: 'focusedChildQuestionEditCard' },

          style: {
            backgroundColor: blue, //"white"
            "button": {
              color: "white"
            }
          }
        }
      ]
    },
    //=========== Input ===========//
    MuiInput: {
      styleOverrides: {
        root: {
          ":before": {
            borderBottom: 'none',
            content: `none`
          }
        }
      }
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: 'pink',
          },
        }
      }
    },
    //=========== Menu item ===========//
    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 0
        }
      }
    },
    //=========== Autocomplete ===========//
    MuiOutlinedInput: {

      styleOverrides: {
        root: {

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: blue,
            borderRadius: 10,
          }
        },
        notchedOutline: {
          borderWidth: 1,
          borderRadius: 10,
        },
      }
    },
    //Create patient button
    MuiList: {
      variants: [
        {
          props: { className: 'toButtom' },
          style: {
            marginTop: "auto",
            marginRight: 10,
            marginLeft: 10
          }
        }
      ]
    },
    MuiListItem: {
      variants: [
        {
          props: { className: 'newPatientButton' },
          style: {
            backgroundColor: blue,
            borderRadius: 200,
            color: "white",
            height: '43px',            
              ":hover": {
                backgroundColor: blue,
              }
          }
        }
      ]
    },
    //End of create patient button
    MuiAutocomplete: {
      variants: [
        {
          // Chip on tasklist (alarm)
          props: { className: 'search' },
          style: {
            backgroundColor: 'white',
            borderRadius: 10,
            border: "none"
          }
        }
      ],
      styleOverrides: {
        root: {
          "fieldset": { borderWidth: 0 },
        }
      }
    },
    //=========== Avatar ===========//
    MuiAvatar: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: blue + '!important',
          height: "80px",
          width: "80px"
        }
      }
    },
    //=========== Paper ===========//
    MuiPaper: {
      variants: [
        {
          props: { elevation: 1 },
          style: {
            boxShadow: "none"
          }
        }
      ]
    },
    //=========== Table ===========//
    MuiTable: {
      styleOverrides: {
        root: {
          border: 'none'
        }
      }
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          boxShadow: 'none'
        }
      }
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          borderBottom: '3px solid #f2f2f2',
          "& .MuiTableCell-head": {
            fontWeight: 'bold'
          }
        }
      }
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f2f2f2'
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
          fontSize: 14,
          padding: 20
        }
      },
      // Answer table
      variants: [
        {
          props: { className: 'answer__table-head' },
          style: {
            width: '15%',
            padding: 20
          }
        }
      ]
    },
    //=========== Alert ===========/
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 28
        }
      },
      variants: [
        {
          props: { severity: 'info' },
          style: {
            backgroundColor: mainBackground,
          },
        },
        // Unread answer alerts
        {
          props: { severity: 'success', className: "darkColor" },
          style: {
            backgroundColor: green
          },
        },
        {
          props: { severity: 'warning', className: "darkColor" },
          style: {
            backgroundColor: yellow,
          },
        }, {
          props: { severity: 'error', className: "darkColor" },
          style: {
            backgroundColor: red,
          },
        }
      ]
    },
    //=========== Dialog ===========//
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          borderBottom: "3px solid #f2f2f2",
          marginBottom: 10,
          padding: 20
        }
      }
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 20
        }
      }
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          borderTop: "3px solid #f2f2f2",
          padding: 20
        }
      }
    },
    //=========== Card ===========//
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20
        }
      },
      variants: [
        {
          props: { className: 'user' },
          style: {
            backgroundColor: 'transparent'
          }
        }
      ]
    },
    MuiCardActions: {
      variants: [
        {
          props: { className: 'user__card-logout' },
          style: {
            justifyContent: 'flex-end'
          }
        }
      ]
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 20,
          position: 'relative',
          ":last-child": {
            paddingBottom: 20
          }
        }
      }
    },
    //=========== Chip ===========//
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          fontsize: 11
        },
        label: {
          padding: 0
        }
      },
      variants: [
        {
          props: { className: "darkColor", color: "error" },
          style: {
            backgroundColor: red
          }
        },
        {
          props: { className: "darkColor", color: "warning" },
          style: {
            backgroundColor: yellow
          }
        },
        {
          props: { className: "darkColor", color: "success" },
          style: {
            backgroundColor: green
          }
        },
        {
          // Chip on tasklist (alarm)
          props: { className: 'chip__alarm' },
          style: {
            borderRadius: '50%',
            height: 47,
            width: 47,
            fontWeight: 'bold'
          }
        },
        {
          // Chip on answers
          props: { className: 'answer__chip' },
          style: {
            height: 47,
            fontSize: 14
          }
        },
        {
          props: { variant: 'filled', color: 'success', className: 'chip__alarm' },
          style: {
            backgroundColor: green
          },
        },
        {
          props: { variant: 'filled', color: 'warning', className: 'chip__alarm' },
          style: {
            backgroundColor: yellow
          }
        },
        {
          props: { variant: 'filled', color: 'error', className: 'chip__alarm' },
          style: {
            backgroundColor: red
          }
        },
        {
          props: { variant: 'filled', color: 'primary', className: 'chip__alarm' },
          style: {
            backgroundColor: blue
          }
        },
        {
          props: { variant: 'filled', color: 'success', className: 'answer__chip' },
          style: {
            backgroundColor: greenLight,
            color: black,
            fontSize: 16
          },
        },
        {
          props: { variant: 'filled', color: 'warning', className: 'answer__chip' },
          style: {
            backgroundColor: yellowLight,
            color: black,
            fontSize: 16
          }
        },
        {
          props: { variant: 'filled', color: 'error', className: 'answer__chip' },
          style: {
            backgroundColor: redLight,
            color: black,
            fontSize: 16
          }
        }
      ]
    },
    //=========== Collapse ===========//
    MuiCollapse: {
      variants: [
        {
          props: { className: 'user__card-collapse' },
          style: {
            backgroundColor: 'white'
          }
        }
      ]
    },

    //=========== Accordion ===========// 
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          borderTop: 'none',
          marginBottom: 20,
          ":first-of-type": {
            borderRadius: 20
          },
          ":last-of-type": {
            borderRadius: 20
          },
          ":before": {
            backgroundColor: 'transparent'
          }
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          borderBottom: '3px solid #f2f2f2',
          fontWeight: 'bold'
        }
      }
    },
    MuiAccordionActions: {
      styleOverrides: {
        root: {
          borderTop: '3px solid #f2f2f2',
          padding: 20
        }
      }
    },
    //=========== Buttons ===========//
    MuiButtonBase: {
      styleOverrides: {
        root: {
          border: 'none'
        }
      },
      variants: [
        {
          props: { className: 'user__card' },
          style: {
            backgroundColor: 'transparent'
          }
        }
      ]
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          border: "none",
          borderWidth: 0
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          opacity: 1,
        },

      }
    },
    MuiTabs: {
      styleOverrides: {
        root: {

        },
        indicator: {
          backgroundColor: blue
        }
      }
    },



    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 30,
          textTransform: 'capitalize',
          fontWeight: 'bold',
          padding: 10,
          boxShadow: 'none',
          ":hover": {
            boxShadow: 'none',
          }
        }
      },
      variants: [
        {
          props: { variant: "text", color: "primary" },
          style: {
            color: blue,
            padding: 0,
          }
        },
        {
          props: { className: "darkColor border", color: "error" },
          style: {
            color: red,
            borderColor: red,
            borderWidth: "2px",
            ":hover": {
              color: red,
              borderColor: red,
              borderWidth: "2px",
            }
          }
        },
        {
          // Patient name button
          props: { className: "patient__button" },
          style: {
            backgroundColor: 'transparent',
            color: black,
            height: 47,
            padding: '0 20px',
            '&:hover': {
              background: blueLight,
              opacity: '1'
            }
          }
        },
        {
          // Patient name button
          props: { className: "answer__button" },
          style: {
            backgroundColor: blue,
            color: 'white',
            height: 47,
            padding: '0 20px',
            minWidth: '137px',
            ":hover": {
              backgroundColor: blue,
              opacity: '0.7',
              boxShadow: 'none',
            }
          }
        },
        {
          props: { className: "remove-alarm__button" },
          style: {
            backgroundColor: blue,
            color: 'white',
            height: 47,
            padding: '0 20px',
            minWidth: '137px',
            ":hover": {
              backgroundColor: blue,
              opacity: '0.7',
              boxShadow: 'none',
            }
          }
        },
        {
          props: { className: "accept__button" },
          style: {
            backgroundColor: blue,
            width: 120,
            ":hover": {
              backgroundColor: blue,
              opacity: '0.7',
              boxShadow: 'none',
            }
          }
        },
        {
          props: { className: "MuiButton-containedPrimary" },
          style: {
            backgroundColor: blue
          }
        },
        {
          // Create patient button
          props: { className: "accordion__button" },
          style: {
            margin: 0,
            padding: '10px 20px'
          }
        },
        {
          // Create patient button
          props: { className: "decline__button" },
          style: {
            margin: 0,
            padding: '10px 20px'
          }
        }
      ],
    },
  }
});

export default MyApp
