import useSWR from 'swr'
import {createClient} from 'urql'
import NProgress from 'nprogress'
import React from 'react'
import {useSnackbar} from 'notistack';
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'
// import tokenList from '@sushiswap/default-token-list/build/sushiswap-default.tokenlist.json'

const chainResources = {
    1: {
        name: 'Ethereum',
        explorer: 'https://etherscan.io/tx/',
        subgraph: 'ap0calyp/abracadabra-mainnet-fees'
    },
    42161: {
        name: 'Arbitrum',
        explorer: 'https://arbiscan.io/tx/',
        subgraph: 'ap0calyp/abracadabra-arbitrum-fees'
    },
    250: {
        name: 'Fantom',
        explorer: 'https://ftmscan.com/tx/',
        subgraph: 'ap0calyp/abracadabra-fantom-fees'
    },
    43113: {
        name: 'Avalanche',
        explorer: 'https://snowtrace.io/tx/',
        subgraph: 'ap0calyp/abracadabra-avalanche-fees'
    },
    56: {
        name: 'Binance Smart Chain',
        explorer: 'https://bscscan.com/tx/',
        subgraph: 'ap0calyp/abracadabra-binancesmartchain-fees'
    }
}

export default function LiquidationTable(props) {
    const { address } = props
    // fml I should not have done this with the snackbar
    const snackbar = useSnackbar()
    const { data, error } = useSWR([address, snackbar], getLiquidations, { revalidateOnFocus: false })
    const liquidations = React.useMemo(() =>data && data.length > 0 &&
        data.map(({ transaction, chainId, timestamp, exchangeRate, loanRepaid, collateralRemoved, collateralSymbol, direct }) => {
            return {
                transaction,
                chain: chainResources[chainId].name,
                explorer: chainResources[chainId].explorer,
                timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
                exchangeRate: 1/Number(exchangeRate),
                loanRepaid,
                collateralRemoved,
                collateralSymbol,
                direct
            };
        }),
        [data])
    const indirect = React.useMemo(() => liquidations && liquidations.length > 0 &&
            liquidations.findIndex(liquidation => liquidation.direct === false) > -1,
        [liquidations])

    let headerColumns = [
        {
            header: 'Chain',
        },
        {
            header: 'Timestamp',
        },
        {
            header: 'Transaction',
        },
        {
            header: 'Liquidated Price',
        },
        {
            header: 'Collateral Removed'
        },
        {
            header: 'Loan Repaid',
        }
    ].map(column => <Th key={column.header}>{column.header}</Th>);

    return <>
        { error && <div>Error: {error}</div>}
        { (!liquidations || liquidations.length === 0) && <div className={"note"}>No liquidations found for {address}</div>}
        { liquidations && liquidations.length > 0 && <>
            <Table>
                <Thead><Tr>{ headerColumns }</Tr></Thead>
                <Tbody>
                    { liquidations.map(liquidation => {
                        const { transaction, chain, explorer, timestamp, exchangeRate, loanRepaid, collateralRemoved, collateralSymbol, direct } = liquidation
                        return <Tr key={transaction}>
                            <Td>{chain}</Td>
                            <Td>{timestamp}</Td>
                            <Td><a target="_blank" rel="noreferrer" href={explorer + transaction}>Block Explorer</a>{!direct && ' *'}</Td>
                            <Td>{exchangeRate} USD</Td>
                            <Td>{collateralRemoved} {collateralSymbol}</Td>
                            <Td>{loanRepaid} MIM</Td>
                        </Tr>
                    })}
                </Tbody>
            </Table>
            {indirect === true && <div className={"note"}>* Possibly liquidation but not provable from available subgraph data.</div>}
        </>}
    </>
}

export async function getLiquidationsFromGraph(address, chainId, snackbar) {
    const { subgraph } = chainResources[chainId]
    const clientOptions = {
        url: `https://api.thegraph.com/subgraphs/name/${subgraph}`
    }
    const queryString = `{ userLiquidations(where: {user : "${address}", timestamp_gt: 0}) {transaction exchangeRate timestamp loanRepaid direct collateralRemoved cauldron { collateralSymbol } }}`
    const result = await createClient(clientOptions)
        .query(queryString)
        .toPromise()
    if (result.error) {
        snackbar.enqueueSnackbar(`Failed fetching data from [${subgraph}]`);
        return []
    }
    return result.data.userLiquidations.map(liq => {
        const { transaction, exchangeRate, timestamp, loanRepaid, direct, collateralRemoved, cauldron } = liq
        const { collateralSymbol } = cauldron;
        return {
            transaction,
            exchangeRate,
            timestamp,
            loanRepaid,
            direct,
            collateralRemoved,
            collateralSymbol,
            chainId
        }
    })
}
export async function getEnsWallet(userAddress) {
    const clientOptions = {
        url: `https://api.thegraph.com/subgraphs/name/ensdomains/ens`
    }
    const queryString = `{ domains(where: {name:"${userAddress.toLowerCase()}"}) { resolvedAddress { id } }}`
    const result = await createClient(clientOptions)
        .query(queryString)
        .toPromise()
    if (result?.data?.domains?.length > 0) {
        return result.data.domains[0].resolvedAddress.id
    } else {
        return userAddress
    }
}


export async function getLiquidations(userAddress, snackbar) {
    NProgress.start()
    let address;
    if(userAddress.indexOf('.') > -1 ) {
        address = await getEnsWallet(userAddress)
    } else {
        address = userAddress.toLowerCase()
    }
    const liquidationArrays = await Promise.all([
        getLiquidationsFromGraph(address, 1, snackbar),
        getLiquidationsFromGraph(address, 42161, snackbar),
        getLiquidationsFromGraph(address, 250, snackbar),
        getLiquidationsFromGraph(address, 43113, snackbar),
        getLiquidationsFromGraph(address, 56, snackbar)
    ])
    NProgress.done()
    return liquidationArrays
        .reduce((prev, curr) => curr && [...prev, ...curr], [])
        .sort((a,b) => b.timestamp - a.timestamp)
}
