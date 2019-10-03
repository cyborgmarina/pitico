/*
  Check the BCH and SLP token balances for the wallet created with the
  create-wallet example app.
*/
import getSlpInstance from './getSlpInstance'

// Set NETWORK to either testnet or mainnet
const NETWORK = process.env.REACT_APP_NETWORK
const SLP = getSlpInstance(NETWORK)

export async function getBalance (wallet, logs = true) {
  const log = logs ? console.log.bind(console) : () => null

  try {
    const mnemonic = wallet.mnemonic

    // root seed buffer
    const rootSeed = SLP.Mnemonic.toSeed(mnemonic)
    // master HDNode
    let masterHDNode
    if (NETWORK === 'mainnet') masterHDNode = SLP.HDNode.fromSeed(rootSeed)
    else masterHDNode = SLP.HDNode.fromSeed(rootSeed, 'testnet') // Testnet

    // HDNode of BIP44 account
    const account = SLP.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = SLP.HDNode.derivePath(account, '0/0')

    // get the cash address
    const cashAddress = SLP.HDNode.toCashAddress(change)
    const slpAddress = SLP.Address.toSLPAddress(cashAddress)

    // first get BCH balance
    const balance = await SLP.Address.details(cashAddress)

    // get token balances
    const tokens = await SLP.Utils.balancesForAddress(slpAddress)
    balance.tokens = tokens

    log(`Balance: ${JSON.stringify(balance, null, 4)}:`)

    return balance
  } catch (err) {
    log('Error in getBalance: ', err.message)
    throw err
  }
}
