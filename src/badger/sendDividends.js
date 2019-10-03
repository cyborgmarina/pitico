/*
  Get the token information based on the id.
*/
import { sendBch } from './sendBch'
import getSlpInstance from './getSlpInstance'
const Utils = require('slpjs').Utils

// Set NETWORK to either testnet or mainnet
const NETWORK = process.env.REACT_APP_NETWORK

// Instantiate SLP based on the network.
const SLP = getSlpInstance(NETWORK)

export async function balancesForToken (tokenId) {
  try {
    const balances = await SLP.Utils.balancesForToken(tokenId)
    return balances
  } catch (err) {
    console.error('Error in getTokenInfo: ', err)
    throw err
  }
}

export const sendDividends = async (wallet, { value, tokenId }) => {
  const balances = await balancesForToken(tokenId)

  const total = balances.reduce((p, c) => c.tokenBalance + p, 0)

  for (let i = 0; i < balances.length; i++) {
    const balance = balances[i]
    const address = Utils.toCashAddress(balance.slpAddress)
    if (address === wallet.cashAddress) {
      continue
    }

    try {
      return await sendBch(wallet, {
        value: value * (balance.tokenBalance / total),
        address: address
      })
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      i--
    }
  }
}
