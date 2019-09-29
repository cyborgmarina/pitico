import React, { useEffect, useState } from "react";
import { useBadger } from "./useBadger";
import { getBalance } from "./getBalance";
import { createToken } from "./createToken";
import { sendToken } from "./sendToken";
import { mintToken } from "./mintToken";
import { sendDividends } from "./sendDividends";
import { useWallet } from "./useWallet";
export const WalletContext = React.createContext();

export const WalletProvider = ({ children }) => {
  const { wallet, balances, tokens, loading, update } = useWallet();

  useEffect(() => {
  //     const w = getWallet();
  //     setWallet(w);
  //     getBalance(w)
  //         .then((balance) => {
  //             if(balance.tokens && balance.tokens.length > 0) {
  //                 sendToken(w, { address: 'slptest:qzmxdkn43xafya0cfmxh3hqnumtfwwyntge0f6uc82', tokenId: balance.tokens[0].tokenId, qty: 1 });
  //                 mintToken(w, { tokenId: balance.tokens[0].tokenId, qty: 1 });
  //             }
  //         });
  //     createToken(w, { tokenName: 'consagrado', tokenSymbol: 'consagrado', qty: 100 })
      setTimeout(() => {
        // sendDividends(wallet, { tokenId: '3891394a2c664af25a8d8009da696b81cfe16a671f98099c9e5232f920b4cfb1', value: 0.00001 });
      }, 10000);
  }, []);

  return (
    <WalletContext.Provider value={{ wallet, balances, tokens, loading, update }}>
      {children}
    </WalletContext.Provider>
  );
};
