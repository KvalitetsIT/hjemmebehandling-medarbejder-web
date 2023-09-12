interface Env {    
    REACT_APP_BFF_BASE_URL: string
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


function validate(key: String, value: String, options: String[]){
    if (!options.includes(value)) {
        throw Error(`Invalid value!\nEnv: ${key}, must correspond to one of the following values:\n\t${options}`)
    }
}

function validateAll(env: Env){
    validate("REACT_APP_NODE_ENV", env.REACT_APP_NODE_ENV, ["development", "production"])
    validate("REACT_APP_MOCK_QUESTIONNAIRE_SERVICE", env.REACT_APP_MOCK_QUESTIONNAIRE_SERVICE, ["true", "false"])
    validate("REACT_APP_MOCK_QUESTION_ANSWER_SERVICE", env.REACT_APP_MOCK_QUESTION_ANSWER_SERVICE, ["true", "false"])
    validate("REACT_APP_MOCK_CAREPLAN_SERVICE", env.REACT_APP_MOCK_CAREPLAN_SERVICE, ["true", "false"])
    validate("REACT_APP_MOCK_PATIENT_SERVICE", env.REACT_APP_MOCK_PATIENT_SERVICE, ["true", "false"])
    validate("REACT_APP_MOCK_PERSON_SERVICE", env.REACT_APP_MOCK_PERSON_SERVICE, ["true", "false"])
    validate("REACT_APP_MOCK_USER_SERVICE", env.REACT_APP_MOCK_USER_SERVICE, ["true", "false"])
    validate("REACT_APP_MOCK_PLANDEFINITION_SERVICE", env.REACT_APP_MOCK_PLANDEFINITION_SERVICE, ["true", "false"])
}

export default function getEnvironment(): Env {
    const env = (window as any)._jsenv || process.env;
    //validateAll(env)
    return env;
}


