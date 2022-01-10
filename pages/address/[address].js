import React from 'react'
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
                    <LiquidationTable address={address} />
                    <br/>
                    <div className="center">made by ap0calyp for the community 🤍</div>
                    <div className="center">Other community sites: <a href="https://wenmerl.in">wenmerl.in</a>, <a href="https://byebyedai.money">byebyedai.money</a> </div>
                </main>

            </div>
        </>
    )
}

export default Address
