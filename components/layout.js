import Head from 'next/head'
import React from 'react'

export const Layout = props => (
    <>
        <Head>
            <title>abracadabra liquidations</title>
        </Head>
        <h1>abracadabra liquidations</h1>
        {props.children}
        <div className={'center'}>made by ap0calyp for the community 🤍</div>
        <div className={'center'}>Other community sites: <a href='https://wenmerl.in'>wenmerl.in</a>, <a href='https://byebyedai.money'>byebyedai.money</a> </div>
    </>
)
