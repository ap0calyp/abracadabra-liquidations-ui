import {useRouter} from 'next/router'
import LiquidationTable from '../../components/liquidationTable'
import Search from '../../components/search'

export default function Address() {
    const router = useRouter()
    if (!router.isReady) {
        return <div>Loading...</div>
    }
    const {address} = router.query
    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} initialAddress={address}/>
            <div className={'center'}>
                <button className={'calculator-button'} onClick={() => router.push('/liquidation-calculator')}>Calculator 🧮</button>
                <button className={'calculator-button'} onClick={() => router.push('/oracle-prices')}>Oracle Prices 🔮</button>
            </div>
            <LiquidationTable address={address} />
        </main>
    )
}
