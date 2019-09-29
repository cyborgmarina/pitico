import SLPSDK from "slp-sdk";
import util from "util";

const NETWORK = process.env.NETWORK

util.inspect.defaultOptions = { depth: 1 }

let SLP
if (NETWORK === `mainnet`)
  SLP = new SLPSDK({ restURL: `https://rest.bitcoin.com/v2/` })
else SLP = new SLPSDK({ restURL: `https://trest.bitcoin.com/v2/` })

export const getTokenInfo = async (tokenId) => {
    try {
        return await SLP.Utils.list(tokenId);
    } catch (error) {
        console.error(error);
    }
};
