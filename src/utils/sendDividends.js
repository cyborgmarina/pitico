/*
  Get the token information based on the id.
*/

import { sendBch } from "./sendBch";
import withSLP from "./withSLP";
let Utils = require("slpjs").Utils;

export const outputsForToken = withSLP(async (SLP, tokenId) => {
  try {
    const balances = await SLP.Utils.balancesForToken(tokenId);
    return balances;
  } catch (err) {
    console.error(`Error in getTokenInfo: `, err);
    throw err;
  }
});

export const sendDividends = withSLP(async (SLP, wallet, { value, tokenId }) => {
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
});
