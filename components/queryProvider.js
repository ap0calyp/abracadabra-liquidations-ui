import {QueryParamProvider} from 'use-query-params';
import {useRouter} from 'next/router';

/**
 * Next.js query param provider.
 */
export default function QueryProvider({ children }) {
    const router = useRouter()

    const history = {
        push: ({ search }) => router.push({ search, pathname: router.pathname }),
        replace: ({ search }) => router.replace({ search, pathname: router.pathname })
    }

    const location = {
        search: router.asPath.replace(/[^?]+/u, ''),
    }

    return (
        <QueryParamProvider history={history} location={location}>
            {children}
        </QueryParamProvider>
    )
}
