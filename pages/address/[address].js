import {useRouter} from 'next/router';
import Head from 'next/head';
import Search from '../../components/search';
import { createClient } from 'urql';
import React from 'react';
import {useTable} from 'react-table';


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

const Address = (props) => {
    const router = useRouter()
    const { address } = router.query
    const { liquidations } = props
    if (!address) {
        router.push('/', undefined,{shallow: true})
    }
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
                const explorer = chainResources[cellInfo.row.values.chainId].explorer;
                return <a target="_blank" rel="noreferrer" href={explorer + cellInfo.row.values.transaction}>Block Explorer</a>
            }
        },
        {
            Header: 'Liquidated Price',
            accessor: 'exchangeRate',
            Cell: cellInfo => {
                return 1/Number(cellInfo.row.values.exchangeRate)
            }
        }

    ], [])
    const tableInstance = useTable({ columns, data: liquidations })

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = tableInstance

    return (
<>
        <div>
            <Head>
                <title>abracadabra liquidations</title>
            </Head>
            <main>
                <h1>abracadabra liquidations</h1>
                <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/', undefined, {shallow: !address})} initialAddress={address}/>
                <br/>
                <br/>
                { liquidations.length === 0 && <div>No liquidations found</div>}
                { liquidations.length > 0 && <table {...getTableProps()}>
                    <thead>
                    {// Loop over the header rows
                        headerGroups.map(headerGroup => (
                            // Apply the header row props
                            <tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                                {// Loop over the headers in each row
                                    headerGroup.headers.map(column => (
                                        // Apply the header cell props
                                        <th key={column.getHeaderProps().key} {...column.getHeaderProps()}>
                                            {// Render the header
                                                column.render('Header')}
                                        </th>
                                    ))}
                            </tr>
                        ))}
                    </thead>
                    {/* Apply the table body props */}
                    <tbody {...getTableBodyProps()}>
                    {// Loop over the table rows
                        rows.map(row => {
                            // Prepare the row for display
                            prepareRow(row)
                            const { key, ...restRowProps} = row.getRowProps();
                            return (
                                // Apply the row props
                                <tr key={key} {...restRowProps}>
                                    {// Loop over the rows cells
                                        row.cells.map(cell => {
                                            // Apply the cell props
                                            const { key, ...restCellProps } = cell.getCellProps();
                                            return (
                                                <td key={key} {...restCellProps}>
                                                    {// Render the cell contents
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
            </main>
        </div>
    </>
    )
}

export default Address

export async function getLiquidationsFromGraph(address, chainId) {
    const { subgraph } = chainResources[chainId]
    const clientOptions = {
        url: `https://api.thegraph.com/subgraphs/name/${subgraph}`
    }
    const queryString = `{ userLiquidations(where: {user : "${address}"}) { transaction exchangeRate timestamp }}`;
    const result = await createClient(clientOptions)
        .query(queryString)
        .toPromise();
    return result.data.userLiquidations.map(liq => {
        let { transaction, exchangeRate, cauldron, timestamp = 0 } = liq;
        return {
            transaction,
            exchangeRate,
            timestamp,
            chainId
        }
    });
}

export async function getServerSideProps(context) {
    const { address } = context.query
    const liquidationArrays = await Promise.all([
        getLiquidationsFromGraph(address, 1),
        getLiquidationsFromGraph(address, 42161),
        getLiquidationsFromGraph(address, 250),
        getLiquidationsFromGraph(address, 43113),
        getLiquidationsFromGraph(address, 56)
    ]);
    const liquidations = liquidationArrays.reduce((prev, curr) => [...prev, ...curr], []);

    return {
        props: {liquidations}
    }
}

