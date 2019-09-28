/*
  Check the BCH and SLP token balances for the wallet created with the
  create-wallet example app.
*/
//const SLPSDK = require("../../lib/SLP").default
import SLPSDK from 'slp-sdk';

// Set NETWORK to either testnet or mainnet
const NETWORK = process.env.NETWORK

// Instantiate SLP based on the network.
let SLP
if (NETWORK === `mainnet`)
  SLP = new SLPSDK({ restURL: `https://rest.bitcoin.com/v2/` })
else SLP = new SLPSDK({ restURL: `https://trest.bitcoin.com/v2/` })

export async function getBalance(wallet) {
  try {
    const mnemonic = wallet.mnemonic

    // root seed buffer
    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
    // master HDNode
    let masterHDNode
    if (NETWORK === `mainnet`) masterHDNode = SLP.HDNode.fromSeed(rootSeed)
    else masterHDNode = SLP.HDNode.fromSeed(rootSeed, "testnet") // Testnet

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = SLP.HDNode.derivePath(account, "0/0")

    // get the cash address
    const cashAddress = SLP.HDNode.toCashAddress(change)
    const slpAddress = SLP.Address.toSLPAddress(cashAddress)

    // first get BCH balance
    let balance = await SLP.Address.details(cashAddress)

    // get token balances
    try {
      const tokens = await SLP.Utils.balancesForAddress(slpAddress)

      balance.tokens = tokens;
    } catch (error) {
      if (error.message === "Address not found") console.log(`No tokens found.`)
      else console.log(`Error: `, error)
    }

    console.log(`Balance: ${JSON.stringify(balance, null, 4)}:`)

    return balance;
  } catch (err) {
    console.error(`Error in getBalance: `, err)
    console.log(`Error message: ${err.message}`)
    throw err
  }
}
