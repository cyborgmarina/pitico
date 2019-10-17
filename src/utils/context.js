import React from "react";
import { useWallet } from "./useWallet";
export const WalletContext = React.createContext();

export const WalletProvider = ({ children }) => {
  return <WalletContext.Provider value={useWallet()}>{children}</WalletContext.Provider>;
};
