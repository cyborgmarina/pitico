import { useEffect, useState } from 'react';
import { getWallet } from "./createWallet";
import { getBalance } from './getBalance';
import { getTokenInfo } from './getTokenInfo';

const tokensMap = {};

const updateTokensInfo = async (tokens =[], setTokens) => {
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];

        if (!token.info) {
            try {
                const info = await getTokenInfo(token.tokenId);
                tokens[i] = {
                    ...token,
                    info,
                };
                tokensMap[token.tokenId] = tokens[i];
                setTokens([ ...tokens]);
            } catch(err) {
                i--;
            }
        }
    }
};

const update = async ({ wallet, tokens, setBalances, setTokens, setLoading }) => {
    try {
        const balance = await getBalance(wallet, false)
        setBalances(balance);
        setLoading(false);
        const tokens = balance.tokens.map(token => tokensMap[token.tokenId] || token);
        setTokens(tokens);
        updateTokensInfo(tokens, setTokens);
    } catch(error) {
        console.log('update error', error.message);
    }
};

export const useWallet = () => {
    const [wallet, setWallet] = useState(getWallet());
    const [balances, setBalances] = useState({});
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const w = getWallet();
        setWallet(w);
        setLoading(true);

        const routineId = setInterval(() => {
            update({ wallet, tokens, setBalances, setTokens, setLoading });
        }, 10000);

        return () => {
            clearInterval(routineId);
        };
    }, []);

    useEffect(() => {

    }, [tokens])

    return {
        wallet,
        balances,
        tokens,
        loading,
        update
    };
};

