interface env {

    
    REACT_APP_NODE_ENV : string
    REACT_APP_MOCK_QUESTIONNAIRE_SERVICE : string
    REACT_APP_MOCK_QUESTION_ANSWER_SERVICE : string
    REACT_APP_MOCK_CAREPLAN_SERVICE : string
    REACT_APP_MOCK_PATIENT_SERVICE : string
    REACT_APP_MOCK_PERSON_SERVICE : string
    REACT_APP_MOCK_USER_SERVICE : string
    REACT_APP_MOCK_PLANDEFINITION_SERVICE : string

    //Keycloak
    REACT_APP_KEYCLOAK_URL : string
    REACT_APP_KEYCLOAK_REALM : string
    REACT_APP_KEYCLOAK_CLIENTID : string
    REACT_APP_INACTIVITY_MAX_MINUTES: string
}

export default function getEnvironment(): env {
    const env = (window as any)._jsenv || process.env;
    return env;
}


