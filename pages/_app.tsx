import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import { Container } from '@material-ui/core'
import { MockedBackendApi } from '../apis/MockedBackendApi';
import { BffBackendApi } from '../apis/BffBackendApi';
import ApiContext from './_context';
import { FakeItToYouMakeItApi } from '../apis/FakeItToYouMakeItApi';

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
    <div suppressHydrationWarning>
    <ApiContext.Provider
      value={{backendApi : new BffBackendApi()}}
      //value={{backendApi : new FakeItToYouMakeItApi()}}
    >
        {typeof window === 'undefined' ? null : <Layout><Component {...pageProps} /></Layout>}
        </ApiContext.Provider>
    
    </div>
    </>
    )
  
}
export default MyApp
