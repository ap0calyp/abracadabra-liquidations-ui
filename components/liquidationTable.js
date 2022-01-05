import useSWR from 'swr'
import {createClient} from 'urql'
import NProgress from 'nprogress'
import React from 'react'
import {useSnackbar} from 'notistack';
import {Table, Thead, Tbody, Tr, Th, Td} from 'react-super-responsive-table'

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
    const liquidations = React.useMemo(() => data, [data])

    const columns = [
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
            header: 'MIM Loan Repaid',
        },
        ];


    return (
        <>
            { error && <div>Error: {error}</div>}
            { liquidations && liquidations.length === 0 && <div>No liquidations found</div>}
            { liquidations && liquidations.length > 0 && <Table>
                <Thead>
                    <Tr>
                        { columns.map(column => <Th key={column.header}>{column.header}</Th>) }
                    </Tr>
                </Thead>
                <Tbody>
                    { liquidations.map(liquidation => {
                        const { transaction, chainId, timestamp, exchangeRate, loanRepaid } = liquidation
                        return <Tr key={transaction}>
                            <Td>{chainResources[chainId].name}</Td>
                            <Td>{new Date(Number(timestamp) * 1000).toLocaleString()}</Td>
                            <Td><a target="_blank" rel="noreferrer" href={chainResources[chainId].explorer + transaction}>Block Explorer</a></Td>
                            <Td>{1/Number(exchangeRate)}</Td>
                            <Td>{loanRepaid}</Td>
                        </Tr>
                    })
                    }
                </Tbody>
            </Table>}
        </>
    )
}

export async function getLiquidationsFromGraph(address, chainId, snackbar) {
    const { subgraph } = chainResources[chainId]
    const clientOptions = {
        url: `https://api.thegraph.com/subgraphs/name/${subgraph}`
    }
    const queryString = `{ userLiquidations(where: {user : "${address}"}) { transaction exchangeRate timestamp loanRepaid }}`
    const result = await createClient(clientOptions)
        .query(queryString)
        .toPromise()
    if (result.error) {
        snackbar.enqueueSnackbar(`Failed fetching data from [${subgraph}]`);
        console.error(result.error)
        return []
    }
    return result.data.userLiquidations.map(liq => {
        let { transaction, exchangeRate, timestamp, loanRepaid } = liq
        return {
            transaction,
            exchangeRate,
            timestamp,
            loanRepaid,
            chainId
        }
    })
}

export async function getLiquidations(userAddress, snackbar) {
    NProgress.start()
    const address = userAddress.toLowerCase()
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
