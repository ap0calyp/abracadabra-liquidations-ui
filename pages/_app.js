import '../styles/globals.css'
import {SnackbarProvider} from 'notistack';
import {Layout} from '../components/layout';

function MyApp({ Component, pageProps }) {
  return (
      <>
          <SnackbarProvider maxSnack={3}>
              <Layout>
                  <Component {...pageProps} />
              </Layout>
          </SnackbarProvider>
      </>
  )
}
export default MyApp
