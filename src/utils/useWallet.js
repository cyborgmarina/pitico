import React, { useEffect, useState, useRef } from "react";
import { getWallet, createWallet } from "./createWallet";
import getBalance from "./getBalance";
import getTokenInfo from "./getTokenInfo";
import { getBCHBalanceFromUTXO } from "./sendBch";
import Paragraph from "antd/lib/typography/Paragraph";
import { notification } from "antd";

const tokensCache = {};

const usePrevious = value => {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();

  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
};

const sortTokens = tokens => tokens.sort((a, b) => (a.tokenId > b.tokenId ? 1 : -1));

const updateTokensInfo = async (slpAddress, tokens = [], setTokens) => {
  let infos = [];

  try {
    infos = await getTokenInfo(slpAddress, tokens.map(token => token.tokenId));
  } catch (err) {
    console.log(err.message);
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (!token.info) {
      try {
        const info = infos.find(i => i.tokenIdHex === token.tokenId);

        tokens[i] = {
          ...token,
          info
        };
        tokensCache[token.tokenId] = tokens[i];
        setTokens(sortTokens([...tokens]));
      } catch (err) {
        console.error(err.message);
      }
    }
  }
};

const update = async ({ wallet, tokens, setBalances, setTokens, setLoading, showLoading }) => {
  try {
    if (!wallet) {
      return;
    }
    setLoading(!!showLoading);

    const balance = await getBalance(wallet, false);
    const balanceUTXO = await getBCHBalanceFromUTXO(wallet);
    setBalances({
      ...balance,
      balanceUTXO
    });

    setLoading(false);
    const tokens = balance.tokens.map(token =>
      tokensCache[token.tokenId]
        ? {
            ...token,
            info: tokensCache[token.tokenId].info
          }
        : token
    );
    setTokens(sortTokens(tokens));
    await updateTokensInfo(wallet.slpAddress, tokens, setTokens);
  } catch (error) {
    setLoading(false);
    console.log("update error", error.message);
  }
};

export const useWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [balances, setBalances] = useState({});
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  const previousBalances = usePrevious(balances);

  if (
    previousBalances &&
    previousBalances.totalBalance &&
    balances &&
    balances.totalBalance &&
    previousBalances.totalBalance < balances.totalBalance
  ) {
    notification.success({
      message: "BCH",
      description: (
        <Paragraph>
          You received {Number(balances.totalBalance - previousBalances.totalBalance).toFixed(8)}{" "}
          BCH!
        </Paragraph>
      ),
      duration: 0
    });
  }

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
    }, 5000);

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
    createWallet: importMnemonic => {
      const newWallet = createWallet(importMnemonic);
      setWallet(newWallet);
      update({ wallet: newWallet, tokens, setBalances, setTokens, setLoading, showLoading: true });
    }
  };
};
