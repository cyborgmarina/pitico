/*
  Get the token information based on the id.
*/
import Big from "big.js";
import { Utils } from "slpjs";
import withSLP from "./withSLP";
import { sendBch } from "./sendBch";
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

export const getElegibleAddresses = withSLP(async (SLP, balances, value) => {
  let addresses = [];
  let values = [];

  let elegibleBalances = [...balances];
  while (true) {
    const tokenBalanceSum = elegibleBalances.reduce((p, c) => c.tokenBalance + p, 0);

    const newElegibleBalances = elegibleBalances.filter(elegibleBalance => {
      // const address = Utils.toCashAddress(elegibleBalance.slpAddress);
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
  const satoshisPerByte = 1.2;
  const txFee = SLP.BitcoinCash.toBitcoinCash(Math.floor(satoshisPerByte * byteCount)).toFixed(8);

  return {
    addresses,
    values,
    txFee
  };
});

export const sendDividends = withSLP(async (SLP, { value, tokenId, memo }) => {
  const outputs = await getBalancesForToken(tokenId);

  const { addresses, values } = await getElegibleAddresses(outputs, value);

  const formatteOutputs = addresses.map((address, index) => ({
    address,
    amount: SLP.BitcoinCash.toSatoshi(values[index])
  }));

  return await fetch("https://pay.bitcoin.com/create_invoice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      fiat: "USD",
      memo,
      outputs: formatteOutputs
    })
  })
    .then(res => res.json())
    .then(res => res.paymentUrl)
    .catch(err => {
      debugger;
    });
});
