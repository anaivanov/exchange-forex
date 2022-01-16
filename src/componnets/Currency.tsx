import React, { useEffect, useState } from 'react';
import classes from './Currency.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { TransactionType } from './Exchange';

interface Props {
    fx: string,
    balance: number,
    icon: any,
    onInput: any,
    onSelect: any,
    value: number,
    buyOrSell: TransactionType,
    availableAccounts: any
}

const Currency: React.FC <Props> = props => {
    const [showError, setShowError] = useState<boolean>(false);
    
    useEffect(() => {
        if (props.buyOrSell === TransactionType.SELL) {
            if (props.value > props.balance ) {
                setShowError(true);
            } else {
                setShowError(false);
            }
        }
    }, [props.value, props.balance, props.buyOrSell]);
    
    return <>
        <div className={classes.currency}>
            <div className={classes.balance}>
                <select defaultValue={props.fx} onChange={props.onSelect}>
                    <option value={props.fx}>{props.fx}</option>
                    {props.availableAccounts?.map((curr: any,i: number) => (
                        curr.fx !== props.fx && <option value={curr.fx} key={i}>{curr.fx}</option>
                    ))}
                </select>
                <p>Balance: {props.icon && <FontAwesomeIcon icon={props.icon} />} {props.balance}</p>
            </div>
            <div className={classes.input}>
                <div className={`${props.buyOrSell === TransactionType.SELL ? classes.inputNegative : "" }`}>
                    <input onInput={props.onInput} type="number" placeholder="-0" value={props.value} style={{width:props.value?.toString().length + 1 + "ch"}}/>
                </div>
                <p className={classes.error}>{showError && "exceeds balance"}</p>
            </div>
        </div>
        
    </>
};

export default Currency;