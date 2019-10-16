/*
  Create an HDNode wallet using SLP SDK. The mnemonic from this wallet
  will be used in the other examples.
*/

import SLPSDK from "slp-sdk";
import getSlpInstance from "./getSlpInstance";
// Set NETWORK to either testnet or mainnet
const NETWORK = process.env.REACT_APP_NETWORK;

// Instantiate SLP based on the network.
const SLP = getSlpInstance(NETWORK);

export const getWallet = () => {
  let wallet;
  try {
    wallet = JSON.parse(window.localStorage.getItem("wallet") || undefined);
  } catch (error) {
    // wallet = createWallet();
    // window.localStorage.setItem('wallet', JSON.stringify(wallet));
  }
  return wallet;
};

export const createWallet = importMnemonic => {
  const lang = "english";
  let outStr = "";
  const outObj = {};

  // create 128 bit BIP39 mnemonic
  const mnemonic = importMnemonic
    ? importMnemonic
    : SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang]);
  outStr += "BIP44 $BCH Wallet\n";
  outStr += `\n128 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
  outObj.mnemonic = mnemonic.toString();

  // root seed buffer
  const rootSeed = SLP.Mnemonic.toSeed(mnemonic);

  // master HDNode
  let masterHDNode;
  if (NETWORK === `mainnet`) masterHDNode = SLP.HDNode.fromSeed(rootSeed);
  else masterHDNode = SLP.HDNode.fromSeed(rootSeed, "testnet"); // Testnet

  // HDNode of BIP44 account
  const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'");
  outStr += `BIP44 Account: "m/44'/145'/0'"\n`;

  for (let i = 0; i < 10; i++) {
    const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
    outStr += `m/44'/145'/0'/0/${i}: ${SLP.HDNode.toCashAddress(childNode)}\n`;

    if (i === 0) {
      outObj.cashAddress = SLP.HDNode.toCashAddress(childNode);
      outObj.slpAddress = SLP.Address.toSLPAddress(outObj.cashAddress);
      outObj.legacyAddress = SLP.Address.toLegacyAddress(outObj.cashAddress);
    }
  }

  // derive the first external change address HDNode which is going to spend utxo
  const change = SLP.HDNode.derivePath(account, "0/0");

  // get the cash address
  SLP.HDNode.toCashAddress(change);

  // Get the legacy address.

  outStr += `\n\n\n`;

  window.localStorage.setItem("wallet", JSON.stringify(outObj));
  return outObj;
};
