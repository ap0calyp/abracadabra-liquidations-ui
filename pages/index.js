import Head from 'next/head'
import Search from '../components/search'
import {useRouter} from 'next/router';


const Home = (props) => {
    const router = useRouter()

  return (
    <div>
      <Head>
        <title>abracadabra liquidations</title>
      </Head>
      <main>
        <h1>abracadabra liquidations</h1>
        <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/', undefined, {shallow: !address})} />
      </main>
    </div>
  )
}

export default Home
