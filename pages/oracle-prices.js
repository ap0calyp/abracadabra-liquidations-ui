import {useRouter} from 'next/router'
import Search from '../components/search'
import OraclePrices from '../components/oraclePrices'

export default function OraclePricesPage() {
    const router = useRouter()

    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
            <div className={'center'}>
                <button className={'calculator-button'} onClick={() => router.push('/liquidation-calculator')}>Calculator 🧮</button>
                <button className={'calculator-button'} disabled>Oracle Prices 🔮</button>
            </div>
            <OraclePrices/>
        </main>
    )
}
