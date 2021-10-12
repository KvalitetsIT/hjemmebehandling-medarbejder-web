

import React, { useState, useEffect, createContext } from 'react';
import { IBackendApi } from '../apis/IBackendApi';
import { MockedBackendApi } from '../apis/MockedBackendApi';

interface IApiContext {
    backendApi : IBackendApi
}

const ApiContext = createContext<IApiContext>({backendApi : new MockedBackendApi()}); //Default value

export default ApiContext;
