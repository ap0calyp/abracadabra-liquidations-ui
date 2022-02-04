import {QueryParamProvider} from 'use-query-params'
import {useRouter} from 'next/router'

/**
 * Next.js query param provider.
 */
export default function QueryProvider({ children }) {
    const router = useRouter()

    const history = {
        push: ({ search }) => {
            // console.log({search})
            router.replace({ search, pathname: router.pathname }, undefined, { scroll: false, shallow: true })
        },
        replace: ({ search }) => {
            // console.log({search})
            router.replace({ search, pathname: router.pathname }, undefined, { scroll: false, shallow: true })
        }
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
