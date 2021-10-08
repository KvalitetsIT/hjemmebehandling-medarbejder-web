import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Layout } from '../components/Layout/layout'
import { Container } from '@material-ui/core'

function MyApp({ Component, pageProps }: AppProps) {
  
  return (
    <>
    <Layout>
    <Component {...pageProps} />
    </Layout>
    
    </>
    )
  
}
export default MyApp
