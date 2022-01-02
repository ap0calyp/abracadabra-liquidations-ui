import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Search from './search'
import {useRouter} from 'next/router';


const Home = (props) => {
    const router = useRouter()

  return (
    <div className={styles.container}>
      <Head>
        <title>abracadabra liquidations</title>
      </Head>
      <main>
        <h1>abracadabra liquidations</h1>
        <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
      </main>
    </div>
  )
}

export default Home
