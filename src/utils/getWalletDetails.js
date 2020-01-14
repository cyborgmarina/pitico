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
    legacyAddress: SLPInstance.Address.toLegacyAddress(cashAddress)
  };
});

const getWalletDetails = (SLPInstance, wallet) => {
  const NETWORK = process.env.REACT_APP_NETWORK;
  const mnemonic = wallet.mnemonic;
  const rootSeedBuffer = SLPInstance.Mnemonic.toSeed(mnemonic);
  let masterHDNode;

  if (NETWORK === `mainnet`) masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer);
  else masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer, "testnet");

  const walletBip44 = deriveAccount({ masterHDNode, path: "m/44'/245'/0'/0/0" });
  const walletPath145 = deriveAccount({ masterHDNode, path: "m/44'/145'/0'/0/0" });
  const walletPathZero = deriveAccount({ masterHDNode, path: "m/44'/0'/0'/0/0" });

  return {
    mnemonic: wallet.mnemonic,
    cashAddress: walletBip44.cashAddress,
    slpAddress: walletBip44.slpAddress,
    legacyAddress: walletBip44.legacyAddress,
    cashAddresses: [walletBip44.cashAddress, walletPath145.cashAddress, walletPathZero.cashAddress],
    slpAddresses: [walletBip44.slpAddress, walletPath145.slpAddress, walletPathZero.slpAddress],

    Bip44: walletBip44,
    Path145: walletPath145,
    PathZero: walletPathZero,
    Accounts: [walletBip44, walletPath145, walletPathZero]
  };
};

export default withSLP(getWalletDetails);
