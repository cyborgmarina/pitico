import withSLP from "./withSLP";
import getWalletDetails from "./getWalletDetails";

export const generateWalletData = mnemonic => {
  const outObj = {};
  outObj.mnemonic = mnemonic;
  const walletDetails = getWalletDetails(outObj);
  outObj.cashAddress = walletDetails.Bip44.cashAddress;
  outObj.slpAddress = walletDetails.Bip44.slpAddress;
  outObj.legacyAddress = walletDetails.Bip44.legacyAddress;
  outObj.slpAddresses = [
    walletDetails.Bip44.slpAddress,
    walletDetails.Path145.slpAddress,
    walletDetails.PathZero.slpAddress
  ];
  outObj.cashAddresses = [
    walletDetails.Bip44.cashAddress,
    walletDetails.Path145.cashAddress,
    walletDetails.PathZero.cashAddress
  ];
  return outObj;
};

export const getWallet = () => {
  let wallet;
  try {
    wallet = JSON.parse(window.localStorage.getItem("wallet") || undefined);
    if (!(wallet || {}).slpAddresses && (wallet || {}).mnemonic)
      window.localStorage.setItem("wallet", JSON.stringify(generateWalletData(wallet.mnemonic)));
  } catch (error) {}
  return wallet;
};

export const createWallet = withSLP((SLP, importMnemonic) => {
  const lang = "english";
  // create 128 bit BIP39 mnemonic
  const Bip39128BitMnemonic = importMnemonic
    ? importMnemonic
    : SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang]);
  const outObj = generateWalletData(Bip39128BitMnemonic.toString());
  window.localStorage.setItem("wallet", JSON.stringify(outObj));
  return outObj;
});
