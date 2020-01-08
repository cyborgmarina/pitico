import Big from "big.js";
import withSLP from "./withSLP";
import { DUST } from "./sendDividends";

export const SATOSHIS_PER_BYTE = 1.01;
const NETWORK = process.env.REACT_APP_NETWORK;

export const sendBch = withSLP(async (SLP, wallet, { addresses, values }) => {
  try {
    if (!values.length) {
      return null;
    }

    const value = values.reduce((previous, current) => new Big(current).plus(previous), new Big(0));
    const SEND_ADDR = wallet.cashAddress;

    const u = await SLP.Address.utxo(SEND_ADDR);
    let transactionBuilder;

    // instance of transaction builder
    if (NETWORK === `mainnet`) transactionBuilder = new SLP.TransactionBuilder();
    else transactionBuilder = new SLP.TransactionBuilder("testnet");

    const satoshisToSend = SLP.BitcoinCash.toSatoshi(value.toPrecision(8));
    let originalAmount = new Big(0);
    for (let i = 0; i < u.utxos.length; i++) {
      const utxo = u.utxos[i];
      originalAmount = originalAmount.plus(utxo.satoshis);
      const vout = utxo.vout;
      const txid = utxo.txid;
      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout);
    }

    // get byte count to calculate fee
    const byteCount = SLP.BitcoinCash.getByteCount(
      { P2PKH: u.utxos.length },
      { P2PKH: addresses.length + 1 }
    );
    const satoshisPerByte = SATOSHIS_PER_BYTE;
    const txFee = Math.floor(satoshisPerByte * byteCount);

    // amount to send back to the sending address.
    const remainder = Math.floor(originalAmount.minus(satoshisToSend).minus(txFee));

    if (remainder < 0) {
      throw new Error(`Insufficient funds`);
    }

    // add output w/ address and amount to send
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      transactionBuilder.addOutput(address, SLP.BitcoinCash.toSatoshi(values[i]));
    }

    if (remainder) {
      transactionBuilder.addOutput(SEND_ADDR, remainder);
    }

    // Generate a keypair from the change address.
    const keyPair = SLP.HDNode.toKeyPair(wallet.change);

    // Sign the transactions with the HD node.
    for (let i = 0; i < u.utxos.length; i++) {
      const utxo = u.utxos[i];
      transactionBuilder.sign(
        i,
        keyPair,
        undefined,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        utxo.satoshis
      );
    }

    // build tx
    const tx = transactionBuilder.build();
    // output rawhex
    const hex = tx.toHex();

    // Broadcast transation to the network
    const txidStr = await SLP.RawTransactions.sendRawTransaction([hex]);
    let link;
    if (NETWORK === `mainnet`) {
      link = `https://explorer.bitcoin.com/bch/tx/${txidStr}`;
    } else {
      link = `https://explorer.bitcoin.com/tbch/tx/${txidStr}`;
    }
    console.log(link);

    return link;
  } catch (err) {
    console.log(`error: `, err);
    throw err;
  }
});

// Generate a change address from a Mnemonic of a private key.
const changeAddrFromMnemonic = withSLP((SLP, mnemonic) => {
  // root seed buffer
  const rootSeed = SLP.Mnemonic.toSeed(mnemonic);

  // master HDNode
  let masterHDNode;
  if (NETWORK === `mainnet`) masterHDNode = SLP.HDNode.fromSeed(rootSeed);
  else masterHDNode = SLP.HDNode.fromSeed(rootSeed, "testnet");

  // HDNode of BIP44 account
  const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/245'/0'");

  // derive the first external change address HDNode which is going to spend utxo
  const change = SLP.HDNode.derivePath(account, "0/0");

  return change;
});

// Get the balance in BCH of a BCH address.
export const getBCHBalanceFromUTXO = withSLP(async (SLP, wallet) => {
  try {
    const u = await SLP.Address.utxo(wallet.cashAddress);
    let satoshis = new Big(0);
    for (let i = 0; i < u.utxos.length; i++) {
      const utxo = u.utxos[i];
      satoshis = satoshis.plus(utxo.satoshis);
    }
    return SLP.BitcoinCash.toBitcoinCash(Math.floor(satoshis));
  } catch (err) {
    console.error(`Error in getBCHBalanceFromUTXO: `, err);
    throw err;
  }
});

// Get the balance in BCH of a BCH address.
const getBCHBalance = withSLP(async (SLP, addr, verbose) => {
  try {
    const result = await SLP.Address.details(addr);

    if (verbose) console.log(result);

    const bchBalance = result;

    return bchBalance.balance + bchBalance.unconfirmedBalance;
  } catch (err) {
    console.error(`Error in getBCHBalance: `, err);
    console.log(`addr: ${addr}`);
    throw err;
  }
});

// Returns the utxo with the biggest balance from an array of utxos.
const findBiggestUtxo = utxos => {
  let largestAmount = 0;
  let largestIndex = 0;

  for (var i = 0; i < utxos.length; i++) {
    const thisUtxo = utxos[i];

    if (thisUtxo.satoshis > largestAmount) {
      largestAmount = thisUtxo.satoshis;
      largestIndex = i;
    }
  }

  return utxos[largestIndex];
};

export const calcFee = withSLP(async (SLP, { wallet }) => {
  const u = await SLP.Address.utxo(wallet.cashAddress);
  const byteCount = SLP.BitcoinCash.getByteCount({ P2PKH: u.utxos.length }, { P2PKH: 2 });
  const satoshisPerByte = SATOSHIS_PER_BYTE;
  const txFee = SLP.BitcoinCash.toBitcoinCash(Math.floor(satoshisPerByte * byteCount));
  return txFee;
});
