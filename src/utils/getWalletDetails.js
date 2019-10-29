import withSLP from "./withSLP";

const getWalletDetails = (SLPInstance, wallet) => {
  const NETWORK = process.env.REACT_APP_NETWORK;
  const mnemonic = wallet.mnemonic;
  const rootSeedBuffer = SLPInstance.Mnemonic.toSeed(mnemonic);
  let masterHDNode;
  if (NETWORK === `mainnet`) masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer);
  else masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer, "testnet");

  const hdNodeBip44Account = SLPInstance.HDNode.derivePath(masterHDNode, "m/44'/245'/0'");
  const change = SLPInstance.HDNode.derivePath(hdNodeBip44Account, "0/0");
  const cashAddress = SLPInstance.HDNode.toCashAddress(change);
  const slpAddress = SLPInstance.Address.toSLPAddress(SLPInstance.HDNode.toCashAddress(change));

  return {
    cashAddress,
    slpAddress,
    fundingWif: SLPInstance.HDNode.toWIF(change),
    fundingAddress: SLPInstance.Address.toSLPAddress(cashAddress),
    legacyAddress: SLPInstance.Address.toLegacyAddress(cashAddress),
    change
  };
};

export default withSLP(getWalletDetails);
