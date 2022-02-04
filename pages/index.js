import {useRouter} from 'next/router'
import Search from '../components/search'

export default function Home() {
    const router = useRouter()
    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
            <div className={'center'}>
                <button className={'calculator-button'} onClick={() => router.push('/liquidation-calculator')}>Calculator 🧮</button>
                <button className={'calculator-button'} onClick={() => router.push('/oracle-prices')}>Oracle Prices 🔮</button>
            </div>
        </main>
    )
}
