import Search from '../components/search'
import {useRouter} from 'next/router';

export default function Home() {
    const router = useRouter()
    return (
        <main>
            <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} />
            <div className={"center"}>
                <button className={"calculator-button"} onClick={() => router.push('/liquidation-calculator')}>Calculator 🧮</button>
            </div>
        </main>
    )
}
