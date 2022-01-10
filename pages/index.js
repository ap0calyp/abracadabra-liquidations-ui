import Head from 'next/head'
import Search from '../components/search'
import {useRouter} from 'next/router';

const Home = () => {
    const router = useRouter()
    return (
        <div>
            <Head>
                <title>abracadabra liquidations</title>
            </Head>
            <main>
                <h1>abracadabra liquidations</h1>
                <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
                <div className="center">made by ap0calyp for the community 🤍</div>
                <div className="center">Other community sites: <a href="https://wenmerl.in">wenmerl.in</a>, <a href="https://byebyedai.money">byebyedai.money</a> </div>
            </main>
        </div>
    )
}

export default Home
