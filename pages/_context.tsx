

import React, { useState, useEffect, createContext } from 'react';
import { IBackendApi } from '../apis/IBackendApi';
import { BffBackendApi } from '../apis/BffBackendApi';
import IQuestionnaireService from '../services/IQuestionnaireService';
import QuestionnaireService from '../services/QuestionnaireService';

interface IApiContext {
    backendApi : IBackendApi
    questionnaireService : IQuestionnaireService
}

const ApiContext = createContext<IApiContext>(
    {
        backendApi : new BffBackendApi(),
        questionnaireService : new QuestionnaireService()
    }
    ); //Default value

export default ApiContext;
