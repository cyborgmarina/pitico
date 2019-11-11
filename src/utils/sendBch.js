import withSLP from "./withSLP";

const NETWORK = process.env.REACT_APP_NETWORK;

export const sendBch = withSLP(async (SLP, wallet, { addresses, values }) => {
  try {
    if (!values.length) {
      return null;
    }

    const value = Number(values.reduce((previous, current) => previous + current, 0).toFixed(8));
    const SEND_ADDR = wallet.cashAddress;
    const SEND_MNEMONIC = wallet.mnemonic;

    // Get the balance of the sending address.
    const balance = await getBCHBalance(SEND_ADDR, false);
    // Exit if the balance is zero.
    if (balance <= 0.0) {
      throw new Error(`Balance 0`);
    }

    const u = await SLP.Address.utxo(SEND_ADDR);
    // const utxo = findBiggestUtxo(u.utxos);
    const utxo = u.utxos[0];

    let transactionBuilder;

    // instance of transaction builder
    if (NETWORK === `mainnet`) transactionBuilder = new SLP.TransactionBuilder();
    else transactionBuilder = new SLP.TransactionBuilder("testnet");

    const satoshisToSend = SLP.BitcoinCash.toSatoshi(value);
    // const originalAmount = utxo.satoshis;
    const originalAmount = SLP.BitcoinCash.toSatoshi(balance);
    const vout = utxo.vout;
    const txid = utxo.txid;

    // add input with txid and index of vout
    transactionBuilder.addInput(txid, vout);

    // get byte count to calculate fee. paying 1.2 sat/byte
    // const info = await SLP.Control.getInfo();
    // const relayFee = SLP.BitcoinCash.toSatoshi(info.relayfee);
    const byteCount = SLP.BitcoinCash.getByteCount({ P2PKH: addresses.length }, { P2PKH: 2 });
    const satoshisPerByte = 1.2;
    const txFee = Math.floor(satoshisPerByte * byteCount);

    // amount to send back to the sending address.
    const remainder = originalAmount - satoshisToSend - txFee;

    if (remainder < 0) {
      throw new Error(`Insufficient funds`);
    }

    // add output w/ address and amount to send
    for (let i = 0; i < addresses.length; i++) {
      const address = addresses[i];
      transactionBuilder.addOutput(address, SLP.BitcoinCash.toSatoshi(values[i]));
    }
    transactionBuilder.addOutput(SEND_ADDR, remainder);

    // Generate a keypair from the change address.
    const keyPair = SLP.HDNode.toKeyPair(wallet.change);

    // Sign the transaction with the HD node.
    let redeemScript;
    transactionBuilder.sign(
      0,
      keyPair,
      redeemScript,
      transactionBuilder.hashTypes.SIGHASH_ALL,
      originalAmount
    );

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
  const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

  // derive the first external change address HDNode which is going to spend utxo
  const change = SLP.HDNode.derivePath(account, "0/0");

  return change;
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
