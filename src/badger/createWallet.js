/*
  Create an HDNode wallet using SLP SDK. The mnemonic from this wallet
  will be used in the other examples.
*/

import SLPSDK from "slp-sdk";

// Set NETWORK to either testnet or mainnet
const NETWORK = `mainnet`;

// Instantiate SLP based on the network.
let SLP;
if (NETWORK === `mainnet`)
  SLP = new SLPSDK({ restURL: `https://rest.bitcoin.com/v2/` });
else SLP = new SLPSDK({ restURL: `https://trest.bitcoin.com/v2/` });

export const createWallet = () => {
  const lang = "english";
  let outStr = "";
  const outObj = {};

  // create 128 bit BIP39 mnemonic
  const mnemonic = SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang]);
  outStr += "BIP44 $BCH Wallet\n";
  outStr += `\n128 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
  outObj.mnemonic = mnemonic;

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
  return outObj;
};
