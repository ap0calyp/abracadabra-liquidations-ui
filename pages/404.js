import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Custom404() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/')
    })

    return <div className={'note'}>404</div>
}
