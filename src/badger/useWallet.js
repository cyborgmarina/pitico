import { useEffect, useState } from 'react';
import { getWallet, createWallet } from "./createWallet";
import { getBalance } from './getBalance';
import { getTokenInfo } from './getTokenInfo';

const tokensCache = {};

const sortTokens = tokens => tokens.sort((a, b) => a.tokenId > b.tokenId ? 1 : -1);

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
                tokensCache[token.tokenId] = tokens[i];
                setTokens(sortTokens([ ...tokens]));
            } catch(err) {
                i--;
            }
        }
    }
};

const update = async ({ wallet, tokens, setBalances, setTokens, setLoading, showLoading }) => {
    try {
        if (!wallet) {
            return;
        }
        setLoading(showLoading);

        const balance = await getBalance(wallet, false)
        setBalances(balance);

        setLoading(false);
        const tokens = balance.tokens.map(token => tokensCache[token.tokenId] ? {
            ...token,
            info: tokensCache[token.tokenId].info,
        } : token);
        setTokens(sortTokens(tokens));
        await updateTokensInfo(tokens, setTokens);
    } catch(error) {
        setLoading(false);
        console.log('update error', error.message);
    }
};

export const useWallet = () => {
    const [wallet, setWallet] = useState(null);
    const [balances, setBalances] = useState({});
    const [tokens, setTokens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const w = getWallet();
        if (w) {
            setWallet(w);
            update({ wallet: w, tokens, setBalances, setTokens, setLoading, showLoading: true });
        } else {
            setLoading(false);
        }

        const routineId = setInterval(() => {
            update({ wallet: getWallet(), tokens, setBalances, setTokens, setLoading });
        }, 10000);

        return () => {
            clearInterval(routineId);
        };
    }, []);

    return {
        wallet,
        balances,
        tokens,
        loading,
        update: () => update({ wallet, tokens, setBalances, setTokens, setLoading }),
        updateTokensInfo: () => updateTokensInfo(tokens, setTokens),
        createWallet: (importMnemonic) => {
            const newWallet = createWallet(importMnemonic);
            setWallet(newWallet);
            update({ wallet: newWallet, tokens, setBalances, setTokens, setLoading, showLoading: true });
        }
    };
};
