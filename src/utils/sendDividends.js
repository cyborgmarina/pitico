/*
  Get the token information based on the id.
*/

import SLPSDK from "slp-sdk";
import { sendBch } from "./sendBch";
import getSlpInstance from "./getSlpInstance";
let Utils = require("slpjs").Utils;

// Set NETWORK to either testnet or mainnet
const NETWORK = process.env.REACT_APP_NETWORK;

// Instantiate SLP based on the network.
const SLP = getSlpInstance(NETWORK);

export async function outputsForToken(tokenId) {
  try {
    const balances = await SLP.Utils.balancesForToken(tokenId);
    return balances;
  } catch (err) {
    console.error(`Error in getTokenInfo: `, err);
    throw err;
  }
}

export const sendDividends = async (wallet, { value, tokenId }) => {
  const outputs = await outputsForToken(tokenId);
  const addresses = [];
  const values = [];
  const total = outputs.reduce((p, c) => c.tokenBalance + p, 0);

  for (let i = 0; i < outputs.length; i++) {
    const output = outputs[i];
    const address = Utils.toCashAddress(output.slpAddress);
    if (address === wallet.cashAddress) {
      continue;
    }

    addresses.push(address);
    values.push((output.tokenBalance / total) * value);
  }

  return await sendBch(wallet, { addresses, values });
};
