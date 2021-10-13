

import React, { useState, useEffect, createContext } from 'react';
import { IBackendApi } from '../apis/IBackendApi';
import { BffBackendApi } from '../apis/BffBackendApi';

interface IApiContext {
    backendApi : IBackendApi
}

const ApiContext = createContext<IApiContext>({backendApi : new BffBackendApi()}); //Default value

export default ApiContext;
