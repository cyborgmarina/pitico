import SLPSDK from "slp-sdk";
import getSlpInstance from "./getSlpInstance";

// Set NETWORK to either testnet or mainnet
const NETWORK = process.env.REACT_APP_NETWORK;

// Instantiate SLP based on the network.
const SLP = getSlpInstance(NETWORK);

// Used for debugging and investigating JS objects.
const util = require("util");
util.inspect.defaultOptions = { depth: 1 };

export async function createToken(
  walletInfo,
  { tokenName, tokenSymbol, documentUri, documentHash, qty }
) {
  try {
    const mnemonic = walletInfo.mnemonic;

    // root seed buffer
    const rootSeed = SLP.Mnemonic.toSeed(mnemonic);
    // master HDNode
    let masterHDNode;
    if (NETWORK === `mainnet`) masterHDNode = SLP.HDNode.fromSeed(rootSeed);
    else masterHDNode = SLP.HDNode.fromSeed(rootSeed, "testnet"); // Testnet

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");

    const change = SLP.HDNode.derivePath(account, "0/0");

    // get the cash address and get some tBCH form our faucet https://developer.bitcoin.com/faucets/bch/
    const cashAddress = SLP.HDNode.toCashAddress(change);
    const slpAddress = SLP.Address.toSLPAddress(cashAddress);

    const fundingAddress = slpAddress;
    const fundingWif = SLP.HDNode.toWIF(change); // <-- compressed WIF format
    const tokenReceiverAddress = slpAddress;
    const batonReceiverAddress = slpAddress;
    const bchChangeReceiverAddress = cashAddress;

    // Create a config object defining the token to be created.
    const createConfig = {
      fundingAddress,
      fundingWif,
      tokenReceiverAddress,
      batonReceiverAddress,
      bchChangeReceiverAddress,
      decimals: 0,
      name: tokenName,
      symbol: tokenSymbol,
      documentUri: documentUri || "developer.bitcoin.com",
      documentHash,
      initialTokenQty: qty
    };

    // Generate, sign, and broadcast a hex-encoded transaction for creating
    // the new token.
    const genesisTxId = await SLP.TokenType1.create(createConfig);

    console.log(`genesisTxID: ${util.inspect(genesisTxId)}`);
    console.log(
      `The genesis TxID above is used to uniquely identify your new class of SLP token. Save it and keep it handy.`
    );
    console.log(`View this transaction on the block explorer:`);
    let link;
    if (NETWORK === `mainnet`) {
      link = `https://explorer.bitcoin.com/bch/tx/${genesisTxId}`;
    } else {
      link = `https://explorer.bitcoin.com/tbch/tx/${genesisTxId}`;
    }
    console.log(link);

    return link;
  } catch (err) {
    console.error(`Error in createToken: `, err);
    console.log(`Error message: ${err.message}`);
    throw err;
  }
}
