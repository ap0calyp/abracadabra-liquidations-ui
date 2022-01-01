import {useRouter} from 'next/router';
import styles from '../../styles/Home.module.css';
import Head from 'next/head';
import Search from '../search';
import { createClient } from 'urql';
import React from 'react';
import {useTable} from 'react-table';


const explorers = {
    1: 'https://etherscan.io/tx/',
    42161: 'https://arbiscan.io/tx/',
    250: 'https://ftmscan.com/tx/',
    43113: 'https://snowtrace.io/tx/',
    56: 'https://bscscan.com/tx/'
}

const chains = {
    1: 'Ethereum',
    42161: 'Arbitrum',
    250: 'Fantom',
    43113: 'Avalanche',
    56: 'Binance'
}

const Address = (props) => {
    const router = useRouter()
    const { address } = router.query
    const { liquidations } = props
    if (!address) {
        router.push('/')
    }
    const columns = React.useMemo(() => [
        {
            Header: 'Chain',
            accessor: 'chain',
            Cell: cellInfo => {
                return chains[Number(cellInfo.row.values.chain)]
            }
        },
        {
            Header: 'Transaction',
            accessor: 'transaction',
            Cell: cellInfo => {
                const explorer = explorers[Number(cellInfo.row.values.chain)];
                return <a href={explorer + cellInfo.row.values.transaction}>{cellInfo.row.values.transaction}</a>
            }
        },
        {
            Header: 'Cauldron',
            accessor: 'cauldron'
        },
        {
            Header: 'Block',
            accessor: 'block'
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
        <Search onSearch={(address) => router.push(address ? `/address/${address}` : '/')} initialAddress={address}/>
        <div className={styles.container}>
            <Head>
                <title>abracadabra liquidations</title>
            </Head>
            <main>
                <table {...getTableProps()}>
                    <thead>
                    {// Loop over the header rows
                        headerGroups.map(headerGroup => (
                            // Apply the header row props
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {// Loop over the headers in each row
                                    headerGroup.headers.map(column => (
                                        // Apply the header cell props
                                        <th {...column.getHeaderProps()}>
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
                            return (
                                // Apply the row props
                                <tr {...row.getRowProps()}>
                                    {// Loop over the rows cells
                                        row.cells.map(cell => {
                                            // Apply the cell props
                                            return (
                                                <td {...cell.getCellProps()}>
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

                {/*{*/}
                {/*    liquidations.map(liquidation => <div key={liquidation.id}>*/}
                {/*        {liquidation.block} - {liquidation.transaction} - {liquidation.exchangeRate} - {liquidation.cauldron} - {liquidation.chain}*/}
                {/*    </div>)*/}
                {/*}*/}

            </main>
        </div>
    </>
    )
}

export default Address

export async function getLiquidationsFromGraph(address, graph, chain) {
    const client = createClient({
        url: `https://api.thegraph.com/subgraphs/name/ap0calyp/abracadabra-${graph}-fees`
    });
    const result = await client.query(`{
  userLiquidations(where: {user : "${address}"}) {
    block
    transaction
    exchangeRate
    cauldron
  }
} `).toPromise();
    return result.data.userLiquidations.map(liq => {
        let { block, transaction, exchangeRate, cauldron } = liq;
        return {
            block,
            transaction,
            exchangeRate,
            cauldron,
            chain
        }
    });
}

export async function getServerSideProps(context) {
    const { address } = context.query
    const liquidationArrays = await Promise.all([
        getLiquidationsFromGraph(address, 'mainnet', '1'),
        getLiquidationsFromGraph(address, 'arbitrum', '42161'),
        getLiquidationsFromGraph(address, 'fantom', '250'),
        getLiquidationsFromGraph(address, 'avalanche', '43113'),
        getLiquidationsFromGraph(address, 'binancesmartchain', '56')
    ]);
    const liquidations = liquidationArrays.reduce((prev, curr) => [...prev, ...curr], []);

    return {
        props: {liquidations}
    }
}

