import Search from '../components/search'
import {useRouter} from 'next/router';
import Calculator from '../components/calculator';

export default function LiquidationCalculator() {
    const router = useRouter()

    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
            <Calculator/>
        </main>
    )
}
