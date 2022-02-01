import Document, { Html, Head, Main, NextScript } from 'next/document'
import {QueryParamProvider} from 'use-query-params';
import {useRouter} from 'next/router';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang={"en"}>
                <Head>
                    <meta name="description"
                          content="Locate liquidation events from Abracadabra.money" />
                </Head>
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
