import withSLP from "./withSLP";

const deriveAccount = withSLP((SLPInstance, { masterHDNode, path }) => {
  const node = SLPInstance.HDNode.derivePath(masterHDNode, path);
  const cashAddress = SLPInstance.HDNode.toCashAddress(node);
  const slpAddress = SLPInstance.Address.toSLPAddress(cashAddress);

  return {
    cashAddress,
    slpAddress,
    fundingWif: SLPInstance.HDNode.toWIF(node),
    fundingAddress: SLPInstance.Address.toSLPAddress(cashAddress),
    legacyAddress: SLPInstance.Address.toLegacyAddress(cashAddress),
    change: node
  };
});

const getWalletDetails = (SLPInstance, wallet) => {
  const NETWORK = process.env.REACT_APP_NETWORK;
  const mnemonic = wallet.mnemonic;
  const rootSeedBuffer = SLPInstance.Mnemonic.toSeed(mnemonic);
  let masterHDNode;

  if (NETWORK === `mainnet`) masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer);
  else masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer, "testnet");

  return {
    Bip44: deriveAccount({ masterHDNode, path: "m/44'/245'/0'/0/0" }),
    Path145: deriveAccount({ masterHDNode, path: "m/44'/145'/0'/0/0" }),
    PathZero: deriveAccount({ masterHDNode, path: "m/44'/0'/0'/0/0" })
  };
};

export default withSLP(getWalletDetails);
