/*
  Get the token information based on the id.
*/

import SLPSDK from "slp-sdk";
import { sendBch } from "./sendBch";
let Utils = require('slpjs').Utils;

// Set NETWORK to either testnet or mainnet
const NETWORK = process.env.NETWORK

// Instantiate SLP based on the network.
let SLP
if (NETWORK === `mainnet`)
  SLP = new SLPSDK({ restURL: `https://rest.bitcoin.com/v2/` })
else SLP = new SLPSDK({ restURL: `https://trest.bitcoin.com/v2/` })

export async function balancesForToken(tokenId) {
  try {
    const balances = await SLP.Utils.balancesForToken(tokenId);
    console.log(balances)
    return balances;
  } catch (err) {
    console.error(`Error in getTokenInfo: `, err)
    throw err
  }
}

export const sendDividends = async (wallet, { value, tokenId }) => {
    const balances = await balancesForToken(tokenId);

    const total = balances.reduce((p, c) => c.tokenBalance + p , 0);

    for (let i = 0; i < balances.length; i++) {
      const balance = balances[i];
      
      try {
        await sendBch(wallet, {value: value * (balance.tokenBalance/total), address: Utils.toCashAddress(balance.slpAddress)});
      } catch(error) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        i--;
      }
    }
};
