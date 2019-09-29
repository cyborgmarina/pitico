import SLPSDK from "slp-sdk";
import util from "util";
import getSlpInstance from './getSlpInstance'

let NETWORK = process.env.NETWORK
NETWORK="mainnet";

util.inspect.defaultOptions = { depth: 1 }

const SLP = getSlpInstance(NETWORK);

export const getTokenInfo = async (tokenId) => {
    try {
        return await SLP.Utils.list(tokenId);
    } catch (error) {
        console.error(error);
    }
};
