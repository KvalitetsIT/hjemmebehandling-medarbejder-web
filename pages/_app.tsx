import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import { Container } from '@material-ui/core'

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <>
    <div suppressHydrationWarning>

      {typeof window === 'undefined' ? null : <Layout><Component {...pageProps} /></Layout>}
    
    </div>
    </>
    )
  
}
export default MyApp
