import getWalletDetails from "./getWalletDetails";
import getTokensBchBalance from "./getTokensBchBalance";
import getTransactionHistory from "./getTransactionHistory";
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
    const slpTokensBalance = await SLP.Utils.balancesForAddress([
      walletDetails.Bip44.slpAddress,
      walletDetails.Path145.slpAddress,
      walletDetails.PathZero.slpAddress
    ]);
    bitcoinCashBalance.forEach((element, index) => {
      element.tokens = slpTokensBalance[index];
    });

    const bchBalance = bitcoinCashBalance.reduce((a, b) => a + b.balance + b.unconfirmedBalance, 0);
    console.log("bitcoinCashBalance :", bitcoinCashBalance);
    let tokensBchEquivBalance = await getTokensBchBalance(walletDetails.Bip44.slpAddress);
    tokensBchEquivBalance += await getTokensBchBalance(walletDetails.Path145.slpAddress);
    tokensBchEquivBalance += await getTokensBchBalance(walletDetails.PathZero.slpAddress);
    const totalBalance = bchBalance - tokensBchEquivBalance;

    log(`Balance: ${JSON.stringify(bitcoinCashBalance[0], null, 4)}:`);
    const history = await getTransactionHistory(
      [
        walletDetails.Bip44.cashAddress,
        walletDetails.Path145.cashAddress,
        walletDetails.PathZero.cashAddress
      ],
      [
        bitcoinCashBalance[0].transactions,
        bitcoinCashBalance[1].transactions,
        bitcoinCashBalance[2].transactions
      ]
    );
    console.log("history :", history);
    return {
      ...bitcoinCashBalance[0],
      tokens: [
        ...bitcoinCashBalance[0].tokens,
        ...bitcoinCashBalance[1].tokens,
        ...bitcoinCashBalance[2].tokens
      ],
      totalBalance: totalBalance,
      transient: false
    };
  } catch (err) {
    log(`Error in getBalance: `, err.message);
    throw err;
  }
};

export default withSLP(getBalance);
