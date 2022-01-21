import { useState } from 'react'

export default function Search({ initialAddress, onSearch }) {
    const [newAddress, setNewAddress] = useState(initialAddress)

    return (
        <>
            <div className={"search"}>
            <input
                type="search"
                placeholder="Search by Address or ENS"
                style={{minWidth: 450}}
                defaultValue={initialAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') onSearch(newAddress)
                }}
            />
                <button onClick={() => onSearch(newAddress)}><span>🔎</span></button>
            </div>
        </>
    )
}
