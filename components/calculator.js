import {useState} from 'react';

export default function Calculator() {
    const [collateralPrice, setCollateralPrice] = useState()
    const [collateralDeposited, setCollateralDeposited] = useState()
    const [mimBorrowed, setMimBorrowed] = useState()
    let [mcr, setMcr] = useState()
    const collateralValue = collateralPrice * collateralDeposited;
    const ltv = mimBorrowed / collateralValue;
    const ltvPercent = ltv && Math.round(ltv * 10000) / 100 + '%' || '';
    if (mcr && mcr.endsWith('%')) {
        mcr = mcr.slice(0, -1);
    }
    mcr = Number(mcr);
    const solvent = mcr ? (ltv * 100) < mcr : true
    const liquidationPrice = solvent ? mimBorrowed / (collateralDeposited * mcr) * 100 : '';
    return (
        <div className={'center'}>
            <button disabled>Calculator 🧮</button>
            <br/>
            <br/>
            <div className={'calculator-box'}>
                <label>Collateral Deposited</label>
                <input className={'calculator-input'} onInput={(formEvent) => setCollateralDeposited(formEvent.target.value)} type={"number"} placeholder={'Number of Tokens'}/>
                <label>Collateral Price</label>
                <input className={'calculator-input'} onInput={(formEvent) => setCollateralPrice(formEvent.target.value)} type={"number"} placeholder={'One Token in $'}/>
                <label>MIM Borrowed</label>
                <input className={'calculator-input'} onInput={(formEvent) => setMimBorrowed(formEvent.target.value)} type={"number"}/>
                <label>MCR [Cauldron Parameter]</label>
                <input className={'calculator-input'} onInput={(formEvent) => setMcr(formEvent.target.value)} type={"number"}/>
                <label>LTV (Loan To Value)</label>
                <input className={'calculator-input'} disabled value={ltvPercent || ''} placeholder={'Loan To Value'} style={solvent ? { color: '#ddd'} : { color: '#f00' } }/>
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
                    Liquidation Price = MIM Borrowed / Collateral Deposited * MCR
                </h5>
                <h5>
                    Liquidation Fee = MIM Borrowed * Liquidation Fee Percentage
                </h5>
                <br/>
            </div>
        </div>
    )
}
