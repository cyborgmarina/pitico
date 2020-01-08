import withSLP from "./withSLP";
import getWalletDetails from "./getWalletDetails";

export const getWallet = () => {
  let wallet;
  try {
    wallet = JSON.parse(window.localStorage.getItem("wallet") || undefined);
  } catch (error) {}
  return wallet;
};

export const createWallet = withSLP((SLP, importMnemonic) => {
  const lang = "english";
  const outObj = {};

  // create 128 bit BIP39 mnemonic
  const Bip39128BitMnemonic = importMnemonic
    ? importMnemonic
    : SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang]);

  outObj.mnemonic = Bip39128BitMnemonic.toString();

  const walletDetails = getWalletDetails(outObj);

  outObj.Bip44.cashAddress = walletDetails.cashAddress;
  outObj.Bip44.slpAddress = walletDetails.slpAddress;
  outObj.Bip44.legacyAddress = walletDetails.legacyAddress;

  window.localStorage.setItem("wallet", JSON.stringify(outObj));
  return outObj;
});
