import Search from '../components/search'
import {useRouter} from 'next/router';
import Calculator from '../components/calculator';

export default function LiquidationCalculator() {
    const router = useRouter()

    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
            <div className={'center'}>
                <button className={"calculator-button"} disabled>Calculator 🧮</button>
                {/*<button className={"calculator-button"} onClick={() => router.push('/oracle')}>Oracle Prices 🔮</button>*/}
            </div>
            <Calculator/>
        </main>
    )
}
