import getWalletDetails from "./getWalletDetails";
import getTransactionHistory from "./getTransactionHistory";
import getTokensBalance from "./getTokensBalance";
import withSLP from "./withSLP";

const getBalance = async (SLP, wallet, logs = true) => {
  const log = logs ? console.log.bind(console) : () => null;

  try {
    const walletDetails = getWalletDetails(wallet);

    const bitcoinCashBalance = await SLP.Address.details([
      walletDetails.Bip44.cashAddress,
      walletDetails.Path145.cashAddress,
      walletDetails.PathZero.cashAddress
    ]);

    const slpAdresses = [
      walletDetails.Bip44.slpAddress,
      walletDetails.Path145.slpAddress,
      walletDetails.PathZero.slpAddress
    ];

    const slpTokensBalance = await getTokensBalance(slpAdresses);

    bitcoinCashBalance.forEach((element, index) => {
      element.tokens = slpTokensBalance
        .filter(el => el.adresses.includes(slpAdresses[index]))
        .map(token => ({
          ...token,
          balance: (
            token.tokenBalanceByAddress.find(b => b.slpAddress === slpAdresses[index]) || {}
          ).balanceByAddress,
          satoshisBalance: (
            token.tokenBalanceByAddress.find(b => b.slpAddress === slpAdresses[index]) || {}
          ).satoshisBalanceByAddress,
          address: slpAdresses[index]
        }));
    });

    const bchBalance = bitcoinCashBalance.reduce((a, b) => a + b.balance + b.unconfirmedBalance, 0);

    const tokensBchEquivBalance =
      slpTokensBalance.map(el => el.satoshisBalance).reduce((a, b) => a + b, 0) * 1e-8;
    const totalBalance = bchBalance - tokensBchEquivBalance;

    log(`Balance: ${JSON.stringify(bitcoinCashBalance[0], null, 4)}:`);

    return {
      ...bitcoinCashBalance[0],
      bitcoinCashBalance,
      tokens: slpTokensBalance,
      totalBalance: totalBalance,
      transient: false
    };
  } catch (err) {
    log(`Error in getBalance: `, err.message);
    throw err;
  }
};

export default withSLP(getBalance);
