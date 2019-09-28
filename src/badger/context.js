import React, { useEffect, useState } from "react";
import { useBadger } from "./useBadger";
import { getBalance } from "./getBalance";
import { getWallet } from "./createWallet";
import { createToken } from "./createToken";
import { sendToken } from "./sendToken";
import { mintToken } from "./mintToken";
import { sendCash } from "./sendCash";
export const BadgerContext = React.createContext();

export const BadgerProvider = ({ children }) => {
  const { error } = useBadger();
  const [wallet, setWallet] = useState();
  const [tokens, setTokens] = useState();

    useEffect(() => {
        const w = getWallet();
        setWallet(w);
        getBalance(w)
            .then((balance) => {
                if(balance.tokens && balance.tokens.length > 0) {
                    // sendToken(w, { address: 'slptest:qzmxdkn43xafya0cfmxh3hqnumtfwwyntge0f6uc82', tokenId: balance.tokens[0].tokenId, qty: 1 });
                    // sendToken(w, { address: 'slptest:qzjn7zvkclgq03653fyhjh2xxkw6jrytyqtvad4t7g', tokenId: '3891394a2c664af25a8d8009da696b81cfe16a671f98099c9e5232f920b4cfb1', qty: 10 });
                    // mintToken(w, { tokenId: balance.tokens[0].tokenId, qty: 1 });
                    // mintToken(w, { tokenId: 'a4d605f26294595524f07dfde6398449bea489f8981f51829a1bc618bd23d7dd', qty: 1 });
                }
            });
            // 3891394a2c664af25a8d8009da696b81cfe16a671f98099c9e5232f920b4cfb1
        // createToken(w, { tokenName: 'consagrado', tokenSymbol: 'consagrado', qty: 100 })
        sendCash(w, { tokenId: '3891394a2c664af25a8d8009da696b81cfe16a671f98099c9e5232f920b4cfb1', value: 0.001 });
    }, []);

  return (
    <BadgerContext.Provider value={{ wallet, tokens, error }}>
      {children}
    </BadgerContext.Provider>
  );
};
