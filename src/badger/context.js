import React, { useEffect, useState } from 'react';
import { useBadger } from './useBadger';
import { getBalance } from './getBalance';
import { getWallet } from './createWallet';
// import { createToken } from './createToken';
export const BadgerContext = React.createContext();

export const BadgerProvider = ({ children }) => {
    const {error} = useBadger();
    const [wallet, setWallet] = useState();

    useEffect(() => {
        const w = getWallet();
        setWallet(w);
        // createToken(w, { tokenName: 'hahaha', tokenSymbol: 'hahaha', qty: 1000 })
        getBalance(w);
    }, []);

    return (
        <BadgerContext.Provider value={{ wallet, error }}>
        {children}
        </BadgerContext.Provider>
    );
};
