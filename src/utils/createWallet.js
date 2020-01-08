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

  outObj.cashAddress = walletDetails.Bip44.cashAddress;
  outObj.slpAddress = walletDetails.Bip44slpAddress;
  outObj.legacyAddress = walletDetails.Bip44.legacyAddress;

  window.localStorage.setItem("wallet", JSON.stringify(outObj));
  return outObj;
});
