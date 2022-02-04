import { useState } from 'react'

export default function Search({ initialAddress, onSearch }) {
    const [newAddress, setNewAddress] = useState(initialAddress)

    return (
        <>
            <div className={'search'}>
            <input
                type='search'
                className={'search-input'}
                placeholder='Search by Address or ENS'
                style={{minWidth: 450}}
                defaultValue={initialAddress}
                spellCheck={false}
                onChange={(e) => setNewAddress(e.target.value)}
                onKeyUp={(e) => {
                    if (e.key === 'Enter') onSearch(newAddress)
                }}
            />
                <button className={'search-button'} onClick={() => onSearch(newAddress)}><span>🔎</span></button>
            </div>
        </>
    )
}
