import getWalletDetails from "./getWalletDetails";
import withSLP from "./withSLP";

const getBalance = async (SLP, wallet, logs = true) => {
  const log = logs ? console.log.bind(console) : () => null;

  try {
    const walletDetails = getWalletDetails(wallet);

    let bitcoinCashBip44Balance = await SLP.Address.details(walletDetails.Bip44.cashAddress);
    let bitcoinCashPath145Balance = await SLP.Address.details(walletDetails.Path145.cashAddress);
    let bitcoinCashPathZeroBalance = await SLP.Address.details(walletDetails.PathZero.cashAddress);

    const slpTokensBip44Balance = await SLP.Utils.balancesForAddress(
      walletDetails.Bip44.slpAddress
    );
    bitcoinCashBip44Balance.tokens = slpTokensBip44Balance;
    const slpTokensPath145Balance = await SLP.Utils.balancesForAddress(
      walletDetails.Path145.slpAddress
    );
    bitcoinCashPath145Balance.tokens = slpTokensPath145Balance;
    const slpTokensPathZeroBalance = await SLP.Utils.balancesForAddress(
      walletDetails.PathZero.slpAddress
    );
    bitcoinCashPathZeroBalance.tokens = slpTokensPathZeroBalance;

    log(`Balance: ${JSON.stringify(bitcoinCashBip44Balance, null, 4)}:`);

    return {
      ...bitcoinCashBip44Balance,
      tokens: [
        ...bitcoinCashBip44Balance.tokens,
        ...bitcoinCashPath145Balance.tokens,
        ...bitcoinCashPathZeroBalance.tokens
      ],
      totalBalance:
        bitcoinCashBip44Balance.balance +
        bitcoinCashBip44Balance.unconfirmedBalance +
        bitcoinCashPath145Balance.balance +
        bitcoinCashPath145Balance.unconfirmedBalance +
        bitcoinCashPathZeroBalance.balance +
        bitcoinCashPathZeroBalance.unconfirmedBalance
    };
  } catch (err) {
    log(`Error in getBalance: `, err.message);
    throw err;
  }
};

export default withSLP(getBalance);
