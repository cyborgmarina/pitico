import withSLP from "./withSLP";

const getWalletDetails = (SLPInstance, wallet) => {
  const NETWORK = process.env.REACT_APP_NETWORK;
  const mnemonic = wallet.mnemonic;
  const rootSeedBuffer = SLPInstance.Mnemonic.toSeed(mnemonic);
  let masterHDNode;
  if (NETWORK === `mainnet`) masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer);
  else masterHDNode = SLPInstance.HDNode.fromSeed(rootSeedBuffer, "testnet");

  const path = n => `m/44'/${n}'/0'`;
  const pathToAccount = (node, path) => SLPInstance.HDNode.derivePath(node, path);
  const arrayArg = (func, arr) => arr.map(el => func(el));

  const hdNodeAccounts = arrayArg(path => pathToAccount(masterHDNode, path), [
    path(245),
    path(145),
    path(0)
  ]);

  const changes = arrayArg(hdNodeAccount => pathToAccount(hdNodeAccount, "0/0"), hdNodeAccounts);
  const cashAdresses = arrayArg(change => SLPInstance.HDNode.toCashAddress(change), changes);
  console.log("cashAdresses :", cashAdresses);
  const slpAdresses = arrayArg(
    cashAddress => SLPInstance.Address.toSLPAddress(cashAddress),
    cashAdresses
  );

  const walletDataByAddress = (cashAddress, slpAddress, change) => ({
    cashAddress,
    slpAddress,
    fundingWif: SLPInstance.HDNode.toWIF(change),
    fundingAddress: SLPInstance.Address.toSLPAddress(cashAddress),
    legacyAddress: SLPInstance.Address.toLegacyAddress(cashAddress),
    change: change
  });

  return {
    Bip44: walletDataByAddress(cashAdresses[0], slpAdresses[0], changes[0]),
    Path145: walletDataByAddress(cashAdresses[1], slpAdresses[1], changes[1]),
    PathZero: walletDataByAddress(cashAdresses[2], slpAdresses[2], changes[2])
  };
};

export default withSLP(getWalletDetails);
