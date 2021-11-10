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


function MyApp({ Component, pageProps }: AppProps) : JSX.Element{
  const mockApi = new FakeItToYouMakeItApi()
  const backendApi=new BffBackendApi();
  

  // let careplanService = new CareplanService(backendApi);
  // if (process && process.env.NODE_ENV === 'development') {
  //   if (process.env.MOCK_CAREPLAN_SERVICE === 'true') {
  //     console.log("Mocking careplan backend")
  //     careplanService = new CareplanService(mockApi);
  //   }
  // }
  return (
    <>
    <div suppressHydrationWarning>
    <ApiContext.Provider
      value={{
        questionnaireService : new QuestionnaireService(mockApi),
        questionAnswerService : new QuestionAnswerService(mockApi),
        careplanService : new CareplanService(backendApi),
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
// MyApp.getInitialProps = async (ctx : AppContext ) => {
//   //const res = await fetch('https://api.github.com/repos/vercel/next.js')
//   //const json = await res.json()
//   //return { stars: json.stargazers_count }
//   return {}
// }
export default MyApp
