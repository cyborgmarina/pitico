/*
  Get the token information based on the id.
*/

import SLPSDK from "slp-sdk";
let Utils = require('slpjs').Utils;

// Set NETWORK to either testnet or mainnet
const NETWORK = process.NETWORK

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

export const sendCash = async (wallet, { value, tokenId }) => {
    const balances = await balancesForToken(tokenId);

    const total = balances.reduce((p, c) => c.tokenBalance + p , 0);
    const promises = balances
        .map(balance => new Promise((resolve, reject) => {
            debugger
            const txParams = {
                to: Utils.toCashAddress(balance.slpAddress),
                // from: window.web4bch.bch.defaultAccount,
                from: wallet.cashAddress,
                value: value * (balance.tokenBalance/total)
              }
              window.web4bch.bch.sendTransaction(txParams, (err, res) => {
                if (err) {
                    console.info('transaction error', err);
                    reject(err);
                } else {
                    resolve();
                }
              });
        }));

    return promises;
};
