import Head from 'next/head'
import Search from '../components/search'
import {useRouter} from 'next/router';

const Home = () => {
    const router = useRouter()
    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
        </main>
    )
}

export default Home
