import React, {useCallback, useEffect, useMemo, useState} from 'react';
import Currency from './Currency';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign, faEuroSign, faPoundSign } from '@fortawesome/free-solid-svg-icons';
import classes from './Exchange.module.css';
import useRoundedValue from '../hooks/useRoundedValue';

export enum TransactionType { BUY="buy", SELL="sell" };

const Exchange: React.FC = props => {

    const [exchangeRate, setExchangeRate] = useState<number>(1);
    const [transactionDirection, setTransactionDirection] = useState(TransactionType.SELL);

    const [activeInput, setActiveInput] = useState<TransactionType>(TransactionType.SELL);
    const [activeInputValue, setActiveInputValue] = useRoundedValue(0);

    const inactiveInputValue = useMemo(() => {
        if (activeInput === transactionDirection) { // first input
            return Math.round(activeInputValue * exchangeRate * 100)/100;
        }
        // second input
        return Math.round(activeInputValue / exchangeRate * 100)/100;

    }, [activeInput, activeInputValue, exchangeRate, transactionDirection])

    const [showError, setShowError] = useState(false);

    const availableAccounts = [
        {fx: "USD", balance: 200, icon: faDollarSign},
        {fx: "EUR", balance: 100, icon: faEuroSign},
        {fx: "RON", balance: 10, icon: null},
        {fx: "GBP", balance: 0, icon: faPoundSign},
    ];
    const [baseCurrency, setBaseCurrency] = useState("USD");
    const [toCurrency, setToCurrency] = useState("EUR");
    
    const handleInput = (value: number, shouldUpdateActiveInput: boolean): void => {
        if (shouldUpdateActiveInput) {
            // Set the active input to the other one
            setActiveInput(x => x === TransactionType.SELL ? TransactionType.BUY : TransactionType.SELL);
        }
        setActiveInputValue(Math.abs(value));
    }

    const reqRate = useCallback( async () => {
        // console.log(baseCurrency, toCurrency);
        // https://fcsapi.com/api-v3/forex/latest?symbol=USD/EUR&period=1h&access_key=Zqig6eckUAzvZvsu5Z9N7HF

        let req = await fetch(`https://fcsapi.com/api-v3/forex/latest?symbol=${baseCurrency}/${toCurrency}&period=1h&access_key=${process.env.REACT_APP_API_KEY}`);
        if (req.ok) {
            let res = await req.json();
            setExchangeRate(res.response[0].c);
        } else {
            // Show error
            setShowError(true);
        }

        // setExchangeRate(+Math.random().toFixed(4));
    }, [baseCurrency, toCurrency]);

    useEffect(() => {        
        const timerId = setInterval(()=> {
            // Request a new rate
            reqRate();
        }, 10000) // 10 seconds

        return () => {
            clearInterval(timerId);
        }
    }, [reqRate]);

    useEffect(() => {
        // Request a new rate
        reqRate();
    }, [baseCurrency, toCurrency, reqRate]);


    const swapCurrencies = () => {

        // Update type of transaction
        if (transactionDirection === TransactionType.BUY) {
            setTransactionDirection(TransactionType.SELL)
        } else {
            setTransactionDirection(TransactionType.BUY)
        }
        setActiveInput(x => x === TransactionType.SELL ? TransactionType.BUY : TransactionType.SELL);

    }

    const handleSelect = (value:any, type: TransactionType) => {
        // Update context
        if (transactionDirection === type) { // first input
            if (value === toCurrency) {
                setToCurrency(baseCurrency);
            }
            setBaseCurrency(value);
        } else { // second input
            if (value === baseCurrency) {
                setBaseCurrency(toCurrency);
            }
            setToCurrency(value);
        }

        // Reset inputs
        setActiveInputValue(0);
    };

    const exchangeApp = (
        <>
            <h2>
                {transactionDirection === TransactionType.SELL && "Sell "}
                {transactionDirection === TransactionType.BUY && "Buy "}
                {baseCurrency}
            </h2>
            <p className={classes.textPrimary}>1 {baseCurrency} = {exchangeRate} {toCurrency}</p>
            {availableAccounts.map((curr,i) => curr.fx === baseCurrency && 
                <Currency onSelect={(e:any) => handleSelect(e.target.value, transactionDirection)} onInput={(e: any) => handleInput(e.target.value, transactionDirection !== activeInput)} balance={curr.balance} fx={curr.fx} icon={curr.icon} value={transactionDirection === activeInput ? activeInputValue : inactiveInputValue} key={i} buyOrSell={transactionDirection} availableAccounts={availableAccounts}/>
            )}

            <button onClick={swapCurrencies} className={classes.button}>
                {transactionDirection === TransactionType.SELL && <FontAwesomeIcon icon={faArrowDown} />}
                {transactionDirection === TransactionType.BUY && <FontAwesomeIcon icon={faArrowUp} />}
            </button>

            {availableAccounts.map((curr,i) => curr.fx === toCurrency && 
                <Currency onSelect={(e:any) => handleSelect(e.target.value, transactionDirection === TransactionType.SELL ? TransactionType.BUY : TransactionType.SELL)}  onInput={(e: any) => handleInput(e.target.value, transactionDirection === activeInput)} balance={curr.balance} fx={curr.fx} icon={curr.icon} value={transactionDirection === activeInput ? inactiveInputValue : activeInputValue} key={i} buyOrSell={transactionDirection === TransactionType.SELL ? TransactionType.BUY : TransactionType.SELL} availableAccounts={availableAccounts}/>
            )}

            <button className={classes.sellButton}>
                {transactionDirection === TransactionType.SELL && "Sell "}
                {transactionDirection === TransactionType.BUY && "Buy "}
                {baseCurrency} for {toCurrency}
            </button>
        </>
    )

    return <div>
        {showError && <h2>The application can not be used right now!</h2>}
        {!showError && exchangeApp}
  </div>
};

export default Exchange;