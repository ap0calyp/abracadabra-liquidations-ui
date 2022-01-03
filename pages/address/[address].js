import React from 'react'
import NProgress from 'nprogress'
import {useRouter} from 'next/router';
import LiquidationTable from '../../components/liquidationTable';
import Head from 'next/head';
import Search from '../../components/search';

const Address = () => {
    const router = useRouter()
    if (!router.isReady) {
        return <div>Loading...</div>
    }
    const {address} = router.query
    return (
        <>
            <div>
                <Head>
                    <title>abracadabra liquidations</title>
                </Head>
                <main>
                    <h1>abracadabra liquidations</h1>
                    <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} initialAddress={address}/>
                    <br/>
                    <br/>
                    <LiquidationTable address={address} />
                </main>
            </div>
        </>
    )
}

export default Address
