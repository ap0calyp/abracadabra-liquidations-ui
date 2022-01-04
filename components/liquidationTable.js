import useSWR from 'swr'
import {useTable} from 'react-table'
import {createClient} from 'urql'
import NProgress from 'nprogress'
import React from 'react'
import {useSnackbar} from 'notistack';

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

    const columns = React.useMemo(() => [
        {
            Header: 'Chain',
            accessor: 'chainId',
            Cell: cellInfo => {
                return chainResources[cellInfo.row.values.chainId].name
            }
        },
        {
            Header: 'Timestamp',
            accessor: 'timestamp',
            Cell: cellInfo => {
                return new Date(Number(cellInfo.row.values.timestamp) * 1000).toLocaleString()
            }
        },
        {
            Header: 'Transaction',
            accessor: 'transaction',
            Cell: cellInfo => {
                const explorer = chainResources[cellInfo.row.values.chainId].explorer
                return <a target="_blank" rel="noreferrer" href={explorer + cellInfo.row.values.transaction}>Block Explorer</a>
            }
        },
        {
            Header: 'Liquidated Price',
            accessor: 'exchangeRate',
            Cell: cellInfo => {
                return 1/Number(cellInfo.row.values.exchangeRate)
            }
        },
        {
            Header: 'MIM Loan Repaid',
            accessor: 'loanRepaid'
        }

    ], [])
    const tableInstance = useTable({ columns, data: liquidations || [] })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
        <>
            { error && <div>Error: {error}</div>}
            { liquidations && liquidations.length === 0 && <div>No liquidations found</div>}
            { liquidations && liquidations.length > 0 && <table {...getTableProps()}>
                <thead>
                {/* Loop over the header rows*/
                    headerGroups.map(headerGroup => (
                        /* Apply the header row props*/
                        <tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                            {/* Loop over the headers in each row*/
                                headerGroup.headers.map(column => (
                                    /* Apply the header cell props*/
                                    <th key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                                        {/* Render the header*/
                                            column.render('Header')}
                                    </th>
                                ))}
                        </tr>
                    ))}
                </thead>
                {/* Apply the table body props */}
                <tbody {...getTableBodyProps()}>
                {/* Loop over the table rows*/
                    rows.map(row => {
                        /* Prepare the row for display*/
                        prepareRow(row)
                        const { key, ...restRowProps} = row.getRowProps()
                        return (
                            /* Apply the row props*/
                            <tr key={key} {...restRowProps}>
                                {/* Loop over the rows cells*/
                                    row.cells.map(cell => {
                                        /* Apply the cell props*/
                                        const { key, ...restCellProps } = cell.getCellProps()
                                        return (
                                            <td key={key} {...restCellProps}>
                                                {/* Render the cell contents*/
                                                    cell.render('Cell')}
                                            </td>
                                        )
                                    })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            }
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
    return liquidationArrays.reduce((prev, curr) => curr && [...prev, ...curr], [])
}
