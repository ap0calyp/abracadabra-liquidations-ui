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

        <main className={styles.main}>
        <h1 className={styles.title}>
          abracadabra liquidations
        </h1>
            <br/>

        <Search onSearch={(address) => router.push(`/address/${address}`)} initialAddress=""/>

      </main>

    </div>
  )
}

export default Home
