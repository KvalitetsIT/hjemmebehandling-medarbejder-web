import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import ApiContext from './_context';
import { FakeItToYouMakeItApi } from '../apis/FakeItToYouMakeItApi';
import QuestionnaireService from '../services/QuestionnaireService';
import QuestionAnswerService from '../services/QuestionAnswerService';
import CareplanService from '../services/CareplanService';
import PatientService from '../services/PatientService';
import PersonService from '../services/PersonService';
import { BffBackendApi } from '../apis/BffBackendApi';


function MyApp({ Component, pageProps }: AppProps) {
  let mockApi = new FakeItToYouMakeItApi()
  let backendApi=new BffBackendApi();
  return (
    <>
    <div suppressHydrationWarning>
    <ApiContext.Provider
      value={{
        questionnaireService : new QuestionnaireService(mockApi),
        questionAnswerService : new QuestionAnswerService(mockApi),
        careplanService : new CareplanService(mockApi),
        patientService : new PatientService(mockApi),
        personService : new PersonService(backendApi)
      }}
    >
        {typeof window === 'undefined' ? null : <Layout><Component {...pageProps} /></Layout>}
        </ApiContext.Provider>
    
    </div>
    </>
    )
  
}
export default MyApp
