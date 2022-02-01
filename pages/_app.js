import '../styles/globals.css'
import {SnackbarProvider} from 'notistack';
import {Layout} from '../components/layout';
import {useRouter} from 'next/router';
import QueryProvider from '../components/queryProvider';

export default function MyApp({ Component, pageProps }) {
    const router = useRouter();
  return (
      <>
          <QueryProvider>
          <SnackbarProvider maxSnack={3}>
              <Layout>
                  <Component {...pageProps} />
              </Layout>
          </SnackbarProvider>
          </QueryProvider>
      </>
  )
}
