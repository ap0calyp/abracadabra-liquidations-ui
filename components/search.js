import { useState } from 'react'

export default function Search({ initialAddress, onSearch }) {
    const [newAddress, setNewAddress] = useState(initialAddress)

    return (
        <>
            <br/>
            <span>
            <input
                type="search"
                placeholder="Search by Address"
                style={{minWidth: 450}}
                defaultValue={initialAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') onSearch(newAddress)
                }}
            />
            <button onClick={() => onSearch(newAddress)}>Search</button>
            </span>
        </>
    )
}
