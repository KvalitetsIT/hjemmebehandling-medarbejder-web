import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import { Container } from '@material-ui/core'
import { MockedBackendApi } from '../apis/MockedBackendApi';
import ApiContext from './_context';
import { FakeItToYouMakeItApi } from '../apis/FakeItToYouMakeItApi';
import QuestionnaireService from '../services/QuestionnaireService';
import QuestionAnswerService from '../services/QuestionAnswerService';
import CareplanService from '../services/CareplanService';
import PatientService from '../services/PatientService';
import PersonService from '../services/PersonService';
import { BffBackendApi } from '../apis/BffBackendApi';


function MyApp({ Component, pageProps }: AppProps) {
  let backendApi = new FakeItToYouMakeItApi()
  return (
    <>
    <div suppressHydrationWarning>
    <ApiContext.Provider
      value={{
        questionnaireService : new QuestionnaireService(backendApi),
        questionAnswerService : new QuestionAnswerService(backendApi),
        careplanService : new CareplanService(backendApi),
        patientService : new PatientService(backendApi),
      }}
    >
        {typeof window === 'undefined' ? null : <Layout><Component {...pageProps} /></Layout>}
        </ApiContext.Provider>
    
    </div>
    </>
    )
  
}
export default MyApp
