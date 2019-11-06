/*
  Get the token information based on the id.
*/
import Big from "big.js";
import { Utils } from "slpjs";
import withSLP from "./withSLP";
import { sendBch } from "./sendBch";
import getWalletDetails from "./getWalletDetails";

export const getBalancesForToken = withSLP(async (SLP, tokenId) => {
  try {
    const balances = await SLP.Utils.balancesForToken(tokenId);
    balances.totalBalance = balances.reduce((p, c) => c.tokenBalance + p, 0);
    return balances;
  } catch (err) {
    console.error(`Error in getTokenInfo: `, err);
    throw err;
  }
});

export const getElegibleAddresses = async (wallet, balances, value) => {
  let addresses = [];
  let values = [];
  const elegibleBalances = [...balances];

  for (let i = 0; i < elegibleBalances.length; i++) {
    const output = elegibleBalances[i];
    const address = Utils.toCashAddress(output.slpAddress);

    const tokenBalanceSum = new Big(elegibleBalances.reduce((p, c) => c.tokenBalance + p, 0));
    const outputValue = new Big(output.tokenBalance).div(tokenBalanceSum).mul(new Big(value));
    if (address !== wallet.cashAddress && outputValue.gte(0.00005)) {
      addresses.push(address);
      values.push(Number(outputValue.toFixed(8)));
    } else {
      addresses = [];
      values = [];
      elegibleBalances.splice(i, 1);
      i = -1;
    }
  }

  return {
    addresses,
    values
  };
};

export const sendDividends = async (wallet, { value, tokenId }) => {
  const outputs = await getBalancesForToken(tokenId);

  const walletDetails = getWalletDetails(wallet);

  const { addresses, values } = await getElegibleAddresses(walletDetails, outputs, value);

  return await sendBch(walletDetails, { addresses, values });
};
