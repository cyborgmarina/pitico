import React from 'react';
import SLPSDK from 'slp-sdk';
import { useBadger } from './useBadger';
import { getBalance } from './getBalance';
import { createWallet } from './createWallet';
export const BadgerContext = React.createContext();

const SLP = new SLPSDK();

export const BadgerProvider = ({ children }) => {
  const {error} = useBadger();

  if (error === false) {
    console.info(createWallet());
    getBalance();
  }

  return (
    <BadgerContext.Provider value={{ error }}>
      {children}
    </BadgerContext.Provider>
  );
};
