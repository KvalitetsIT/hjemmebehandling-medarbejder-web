![Build Status](https://github.com/KvalitetsIT/hjemmebehandling-medarbejder-web/workflows/CICD/badge.svg)
# Medarbejder-web
## The Communication and monitoring project (KoMo)
Image a person called Jens. Jens has a condition. His condition makes it nessecary to have his health monitored. He does not need to be monitored 24/7, he just needs to answer and send a questionnaire a couple times a week to the doctor, so the doctor can tell if his condition is getting worse.

Jens will have to send theese questionnaires somewhere, and this is where [patient-web](https://github.com/KvalitetsIT/hjemmebehandling-patient-web) comes ind. Here Jens will log in, and get an overview of his condition, how it evolves, and also give him the ability to tell the doctor how it goes, using a questionnaire. The patient-web will also provide Jens with contact-details for the hospital, at relevant and urgent times.

> The doctor will recieve the questionnaire using the [medarbejder-web](https://github.com/KvalitetsIT/hjemmebehandling-medarbejder-web) where he will be able to quickly see whether Jens' health is going the right or the wrong way. If Jens is getting worse, a form of communication will be performed, either on Jens' initiative or the doctors. 

## Get started
To run:
```
npm run-script generate-api
npm install
npm run-script build
npm start
```
The app should now be available at http://localhost:3000

```
If you use backend api (not mock). This example is the bff is at localhost:8000 
```
BFF_BASE_URL=http://localhost:8080/
```

## How project is created
Created using the following command:

```
npx create-react-app my-app --template typescript
```

https://mui.com/getting-started/installation/ :
```
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/material @mui/styled-engine-sc styled-components
npm install @openapitools/openapi-generator-cli
```

## Configuration

| Environment variable | Description | Required |
|----------------------|-------------|---------- |
| BFF_BASE_URL | Base URL for Backend API server. | Yes |
| NEXT_PUBLIC_MOCK_QUESTIONNAIRE_SERVICE | If true the QuestionnaireApi is mocked, and will not call backendApi | No |
| NEXT_PUBLIC_MOCK_QUESTION_ANSWER_SERVICE | If true the QuestionnaireAnswerApi is mocked, and will not call backendApi | No |
| NEXT_PUBLIC_MOCK_CAREPLAN_SERVICE |If true the CareplanApi is mocked, and will not call backendApi | No |
| NEXT_PUBLIC_MOCK_PATIENT_SERVICE | If true the PatientApi is mocked, and will not call backendApi | No |
| NEXT_PUBLIC_MOCK_USER_SERVICE | If true the UserApi is mocked, and will not call backendApi | No |
| NEXT_PUBLIC_MOCK_PERSON_SERVICE | If true the PersonApi is mocked, and will not call backendApi| No |

