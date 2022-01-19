![Build Status](https://github.com/KvalitetsIT/hjemmebehandling-medarbejder-web/workflows/CICD/badge.svg)
# hjemmebehandling-medarbejder-web

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

https://nextjs.org/docs :
```
npm install next react react-dom
```

To run:
```
npm install
npm run-script build
npm start
```

Track changes and recompile for each new change (suitable for local development);
```
npm run dev
```
If you use backend api (not mock). This example is the bff is at localhost:8000 
```
BFF_BASE_URL=http://localhost:8080/ npm run dev
```

The app should now be available at http://localhost:3000

```
npm run lint
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

