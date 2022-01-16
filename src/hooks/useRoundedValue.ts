import { useState } from "react";

const useRoundedValue = (defaultValue: number) => {
    const [newValue, setNewValue] = useState<number>(defaultValue);

    const setRoundedValue = (val: number):void => {
        setNewValue(Math.round(val * 100) / 100);
    }

    return [newValue, setRoundedValue] as const;
}

export default useRoundedValue;