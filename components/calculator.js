import {StringParam, useQueryParam} from 'use-query-params';

export default function Calculator() {
    const [collateralPrice, setCollateralPrice] = useQueryParam('collateral-price', StringParam)
    const [collateralDeposited, setCollateralDeposited] = useQueryParam('collateral-deposited', StringParam)
    const [mimBorrowed, setMimBorrowed] = useQueryParam('mim-borrowed', StringParam)
    const [mcr, setMcr] = useQueryParam('mcr', StringParam)
    const collateralValue = collateralPrice * collateralDeposited;
    const ltv = mimBorrowed / collateralValue;
    const ltvPercent = Number.isFinite(ltv) && Math.round(ltv * 10000) / 100 + '%' || '';
    const solvent = mcr ? (ltv * 100) < mcr : true
    const liquidationPrice = solvent ? mimBorrowed / (collateralDeposited * mcr) * 100 : '';
    const positionHealth = mcr - (ltv * 100)
    return (
        <div className={'center'}>
            <div className={'calculator-box'}>
                <label>Collateral Deposited</label>
                <input className={'calculator-input'} value={collateralDeposited || ''} onInput={(formEvent) => setCollateralDeposited(formEvent.target.value)} type={"number"} placeholder={'Number of Tokens'}/>
                <label>Collateral Price</label>
                <input className={'calculator-input'} value={collateralPrice || ''} onInput={(formEvent) => setCollateralPrice(formEvent.target.value)} type={"number"} placeholder={'One Token in $'}/>
                <label>MIM Borrowed</label>
                <input className={'calculator-input'} value={mimBorrowed || ''} onInput={(formEvent) => setMimBorrowed(formEvent.target.value)} type={"number"}/>
                <label>MCR [Cauldron Parameter]</label>
                <input className={'calculator-input'} value={mcr || ''} onInput={(formEvent) => setMcr(formEvent.target.value)} type={"number"}/>
                <label>LTV (Loan To Value)</label>
                <input className={'calculator-input'} disabled value={ltvPercent || ''} placeholder={'Loan To Value'} style={solvent ? { color: '#ddd'} : { color: '#f00' } }/>
                <label>Position Health</label>
                <input className={'calculator-input'} disabled value={Number.isFinite(positionHealth) ? positionHealth + '%' : ''} style={solvent ? { color: '#ddd'} : { color: '#f00' } }/>
                <label>Liquidation Price</label>
                <input className={'calculator-input'} disabled value={liquidationPrice || ''} type={"number"}/>
            </div>
            <div>
                <h4>
                    Formula
                </h4>
                <h5>
                    Collateral Value = Collateral Price * Collateral Deposited
                </h5>
                <h5>
                    LTV = MIM Borrowed / Collateral Value
                </h5>
                <h5>
                    Liquidation Price = MIM Borrowed / (Collateral Deposited * MCR)
                </h5>
                <h5>
                    Liquidation Fee = MIM Borrowed * Liquidation Fee Percentage
                </h5>
                <h5>
                    Position Health = MCR - LTV
                </h5>
                <br/>
            </div>
        </div>
    )
}
