import React from 'react'
import {useRouter} from 'next/router';
import LiquidationTable from '../../components/liquidationTable';
import Search from '../../components/search';

export default function Address() {
    const router = useRouter()
    if (!router.isReady) {
        return <div>Loading...</div>
    }
    const {address} = router.query
    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} initialAddress={address}/>
            <LiquidationTable address={address} />
        </main>
    )
}
