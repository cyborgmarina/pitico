import withSLP from "./withSLP";
import getWalletDetails from "./getWalletDetails";

export const getWallet = () => {
  let wallet;
  try {
    wallet = getWalletDetails(JSON.parse(window.localStorage.getItem("wallet") || undefined));
    if (!(wallet || {}).slpAddresses && (wallet || {}).mnemonic)
      window.localStorage.setItem("wallet", JSON.stringify(wallet));
    return wallet;
  } catch (error) {}
  return wallet;
};

export const createWallet = withSLP((SLP, importMnemonic) => {
  const lang = "english";
  // create 128 bit BIP39 mnemonic
  const Bip39128BitMnemonic = importMnemonic
    ? importMnemonic
    : SLP.Mnemonic.generate(128, SLP.Mnemonic.wordLists()[lang]);
  const wallet = getWalletDetails({ mnemonic: Bip39128BitMnemonic.toString() });
  window.localStorage.setItem("wallet", JSON.stringify(wallet));
  return wallet;
});
