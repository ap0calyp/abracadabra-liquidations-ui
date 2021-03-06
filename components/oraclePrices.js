import cauldronAbi from '../abis/cauldron.json'
import oracleAbi from '../abis/oracle.json'
import {Table, Tr, Td, Th, Thead, Tbody} from 'react-super-responsive-table'
import useSWR from 'swr'
import React from 'react'
import NProgress from 'nprogress'
import {StringParam, useQueryParam} from 'use-query-params'

const Web3 = require('web3')

const WEB3 = {
    Ethereum: new Web3('wss://mainnet.infura.io/ws/v3/f6d830edcc1c44b38b066d4b1095194a'),
    Fantom: new Web3('wss://wsapi.fantom.network'),
    Avalanche: new Web3('https://api.avax.network/ext/bc/C/rpc'),
    Arbitrum: new Web3('https://arb1.arbitrum.io/rpc'),
    'Binance Smart Chain': new Web3('https://bsc-dataseed.binance.org')
}

const CAULDRONS = [
    { network: 'Ethereum', token: 'WETH', address: '0x390Db10e65b5ab920C19149C919D970ad9d18A41', decimals: 18 },
    { network: 'Ethereum', token: 'WBTC', address: '0x5ec47EE69BEde0b6C2A2fC0D9d094dF16C192498', decimals: 8 },
    { network: 'Ethereum', token: 'cvx3pool (non deprecated)', address: '0x257101F20cB7243E2c7129773eD5dBBcef8B34E0', decimals: 18 },
    { network: 'Ethereum', token: 'UST V2 (Degenbox)', address: '0x59e9082e068ddb27fc5ef1690f9a9f22b32e573f', decimals: 18 },
    { network: 'Ethereum', token: 'sSPELL (New)', address: '0x3410297D89dCDAf4072B805EFc1ef701Bb3dd9BF', decimals: 18 },
    { network: 'Ethereum', token: 'SPELL (Degenbox)', address: '0xCfc571f3203756319c231d3Bc643Cee807E74636', decimals: 18 },
    { network: 'Ethereum', token: 'FTT', address: '0x9617b633EF905860D919b88E1d9d9a6191795341', decimals: 18 },
    { network: 'Ethereum', token: 'ALGD', address: '0xc1879bf24917ebE531FbAA20b0D05Da027B592ce', decimals: 18 },
    { network: 'Ethereum', token: 'cvxrenCrv', address: '0x35a0Dd182E4bCa59d5931eae13D0A2332fA30321', decimals: 18 },
    { network: 'Ethereum', token: 'SHIB', address: '0x252dCf1B621Cc53bc22C256255d2bE5C8c32EaE4', decimals: 18 },
    { network: 'Ethereum', token: 'cvxtricrypto2', address: '0x4EAeD76C3A388f4a841E9c765560BBe7B3E4B3A0', decimals: 18 },
    { network: 'Ethereum', token: 'yvWETH v2', address: '0x920D9BD936Da4eAFb5E25c6bDC9f6CB528953F9f', decimals: 18 },
    { network: 'Ethereum', token: 'yvstETH', address: '0x0BCa8ebcB26502b013493Bf8fE53aA2B1ED401C1', decimals: 18 },
    { network: 'Ethereum', token: 'yvcrvIB', address: '0xEBfDe87310dc22404d918058FAa4D56DC4E93f0A', decimals: 18},
    { network: 'Ethereum', token: 'xSUSHI', address: '0x98a84EfF6e008c5ed0289655CcdCa899bcb6B99F', decimals: 18 },
    { network: 'Ethereum', token: 'wsOHM', address: '0x003d5A75d284824Af736df51933be522DE9Eed0f', decimals: 18 },
    { network: 'Ethereum', token: 'FTM', address: '0x05500e2Ee779329698DF35760bEdcAAC046e7C27', decimals: 18 },
    { network: 'Ethereum', token: 'ALCX', address: '0x7b7473a76D6ae86CE19f7352A1E89F6C9dc39020', decimals: 18 },
    { network: 'Ethereum', token: 'yvUSDC v2', address: '0x6cbAFEE1FaB76cA5B5e144c43B3B50d42b7C8c8f', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'yvUSDT v2', address: '0x551a7CfF4de931F32893c928bBc3D25bF1Fc5147', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'yvWETH', address: '0x6Ff9061bB8f97d948942cEF376d98b51fA38B91f', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'xSUSHI', address: '0xbb02A884621FB8F5BFd263A67F58B65df5b090f3', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'sSPELL', address: '0xC319EEa1e792577C319723b5e60a15dA3857E7da', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'yvYFI', address: '0xFFbF4892822e0d552CFF317F65e1eE7b5D3d9aE6', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'cvx3pool (old)', address: '0x806e16ec797c69afa8590A55723CE4CC1b54050E', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'cvx3pool (new)', address: '0x6371EfE5CD6e3d2d7C477935b7669401143b7985', decimals: 18, deprecated: true },
    { network: 'Ethereum', token: 'UST (Degenbox)', address: '0xbc36fde44a7fd8f545d459452ef9539d7a14dd63', decimals: 18, deprecated: true },
    { network: 'Fantom', token: 'wFTM (3.5% interest)', address: '0x8E45Af6743422e488aFAcDad842cE75A09eaEd34', decimals: 18 },
    { network: 'Fantom', token: 'wFTM (1.8% interest)', address: '0xd4357d43545F793101b592bACaB89943DC89d11b', decimals: 18 },
    { network: 'Fantom', token: 'yvWFTM', address: '0xed745b045f9495B8bfC7b58eeA8E0d0597884e12', decimals: 18 },
    { network: 'Avalanche', token: 'AVAX', address: '0x3CFEd0439aB822530b1fFBd19536d897EF30D2a2', decimals: 18 },
    { network: 'Avalanche', token: 'wMEMO (deprecated)', address: '0x56984F04d2d04B2F63403f0EbeDD3487716bA49d', decimals: 18, deprecated: true },
    { network: 'Avalanche', token: 'xJOE', address: '0x3b63f81Ad1fc724E44330b4cf5b5B6e355AD964B', decimals: 18 },
    { network: 'Avalanche', token: 'USDC/AVAX JLP', address: '0x95cCe62C3eCD9A33090bBf8a9eAC50b699B54210', decimals: 18 },
    { network: 'Avalanche', token: 'wMEMO', address: '0x35fA7A723B3B39f15623Ff1Eb26D8701E7D6bB21', decimals: 18, deprecated: true },
    { network: 'Avalanche', token: 'USDT/AVAX JLP', address: '0x0a1e6a80E93e62Bd0D3D3BFcF4c362C40FB1cF3D', decimals: 18 },
    { network: 'Avalanche', token: 'MIM/AVAX JLP', address: '0x2450Bf8e625e98e14884355205af6F97E3E68d07', decimals: 18 },
    { network: 'Avalanche', token: 'MIM/AVAX SLP', address: '0xAcc6821d0F368b02d223158F8aDA4824dA9f28E3', decimals: 18 },
    { network: 'Arbitrum', token: 'ETH', address: '0xC89958B03A55B5de2221aCB25B58B89A000215E6', decimals: 18 },
    { network: 'Binance Smart Chain', token: 'CAKE', address: '0xF8049467F3A9D50176f4816b20cDdd9bB8a93319', decimals: 18 },
    { network: 'Binance Smart Chain', token: 'BNB', address: '0x692CF15F80415D83E8c0e139cAbcDA67fcc12C90', decimals: 18 },
]

export default function OraclePrices() {
    const [filter, setFilter] = useQueryParam('filter', StringParam)
    const lowerFilter = filter && filter.toLowerCase() || ''
    const lowerFilterWords = lowerFilter.split(' ')
    const { data, error, mutate } = useSWR({}, getOraclePrices, { revalidateOnFocus: false })
    const oracleValues = React.useMemo(() => {
        if (!data || error) {
            return []
        }
        return data
    }, [data, error])
    const cauldronsToShow = oracleValues && oracleValues.length > 0 &&
        oracleValues
            .filter(oracleValue => !lowerFilter && true
                || (lowerFilterWords.find(lowerFilterWord =>
                    oracleValue.network.toLowerCase().indexOf(lowerFilterWord) > -1
                    || oracleValue.token.toLowerCase().indexOf(lowerFilterWord) > -1))
            ) || []
    return (
        <>
            <h3 className={'center'}>Oracle Prices <button className={'refresh-button'} onClick={() => mutate()}>????</button></h3>
            <input
                onChange={(e) => setFilter(e.target.value)}
                value={filter || ''}
                placeholder={'Filter by...'}
                spellCheck={false}
            />
            <Table>
                <Thead>
                    <Tr>
                        <Th>Network</Th>
                        <Th>Token</Th>
                        <Th>Last Oracle Price</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {
                        cauldronsToShow.map(oracleValue =>
                            <Tr key={oracleValue.address}>
                                <Td>{oracleValue.network}</Td>
                                <Td>{oracleValue.token}{oracleValue.deprecated && ' *'}</Td>
                                <Td>{oracleValue.price} USD</Td>
                            </Tr>
                        )
                    }
                </Tbody>
            </Table>
            { cauldronsToShow.findIndex(cauldron => cauldron.deprecated === true) > -1 &&
            <div className={'center'}>* Deprecated cauldron</div>
            }
            </>
    )
}

async function getCauldronWithPrice(cauldron) {
    const web3 = WEB3[cauldron.network]
    const cauldronContract = new web3.eth.Contract(cauldronAbi, cauldron.address)
    const oracle = await cauldronContract.methods.oracle().call()
    const oracleData = await cauldronContract.methods.oracleData().call()
    const oracleContract = new web3.eth.Contract(oracleAbi, oracle)
    return {
        ...cauldron,
        price: 1 / (await oracleContract.methods.get(oracleData).call())['1'] * Math.pow(10, cauldron.decimals)
    }
}

export async function getOraclePrices() {
    NProgress.start()
    const promises = CAULDRONS.map((cauldron) => getCauldronWithPrice(cauldron))
    const oraclePrices = await Promise.all(promises)
    NProgress.done()
    return oraclePrices
}
