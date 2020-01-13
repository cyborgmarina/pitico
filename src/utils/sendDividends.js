/* eslint-disable no-loop-func */

import { Utils } from "slpjs";
import withSLP from "./withSLP";
import { sendBch, SATOSHIS_PER_BYTE } from "./sendBch";
import getWalletDetails from "./getWalletDetails";

export const DUST = 0.00005;

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

export const getElegibleAddresses = withSLP(async (SLP, wallet, balances, value) => {
  let addresses = [];
  let values = [];

  const walletDetails = getWalletDetails(wallet);

  let elegibleBalances = [
    ...balances.filter(balance => balance.slpAddress !== walletDetails.slpAddress)
  ];
  while (true) {
    const tokenBalanceSum = elegibleBalances.reduce((p, c) => c.tokenBalance + p, 0);

    const newElegibleBalances = elegibleBalances.filter(elegibleBalance => {
      const elegibleValue = Number(
        ((elegibleBalance.tokenBalance / tokenBalanceSum) * value).toFixed(8)
      );
      if (elegibleValue > DUST) {
        addresses.push(Utils.toCashAddress(elegibleBalance.slpAddress));
        values.push(elegibleValue);
        return true;
      }
      return false;
    });

    if (newElegibleBalances.length === elegibleBalances.length) {
      break;
    } else {
      elegibleBalances = newElegibleBalances;
      addresses = [];
      values = [];
    }
    await new Promise(resolve => setTimeout(resolve, 10));
  }

  const byteCount = SLP.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: addresses.length + 1 });
  const satoshisPerByte = SATOSHIS_PER_BYTE;
  const txFee = SLP.BitcoinCash.toBitcoinCash(Math.floor(satoshisPerByte * byteCount)).toFixed(8);

  return {
    addresses,
    values,
    txFee
  };
});

export const sendDividends = async (wallet, { value, tokenId }) => {
  const outputs = await getBalancesForToken(tokenId);

  const { addresses, values } = await getElegibleAddresses(wallet, outputs, value);

  const walletDetails = getWalletDetails(wallet);

  return await sendBch(walletDetails, { addresses, values });
};
