import { useEffect, useState } from 'react';
import { getWallet } from "./createWallet";
import { getBalance } from './getBalance';

export const useWallet = () => {
    const [wallet, setWallet] = useState(getWallet());
    const [balances, setBalances] = useState({});
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const w = getWallet();
        setWallet(w);
        setLoading(true);

        const intervalId = setInterval(() => {
            getBalance(w, false)
            .then((balance = {}) => {
                setBalances(balance);
                setTokens(balance.tokens || []);
                setLoading(false);
            });
        }, 3000);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return {
        wallet,
        balances,
        tokens,
        loading
    };
};

