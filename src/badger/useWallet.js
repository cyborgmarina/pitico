import { useEffect, useState } from 'react';
import { getWallet } from "./createWallet";
import { getBalance } from './getBalance';

export const useWallet = () => {
    const [wallet, setWallet] = useState(getWallet());
    const [balances, setBalances] = useState({});
    const [tokens, setTokens] = useState([]);

    useEffect(() => {
        const w = getWallet();
        setWallet(w);

        const intervalId = setInterval(() => {
            getBalance(w, false)
            .then((balance) => {
                setBalances(balance);
                setTokens(balance.tokens);
            });
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return {
        wallet,
        balances,
        tokens
    };
};

