import withSLP from "./withSLP";

const getTransactionHistory = async (SLP, cashAdresses) => {
  try {
    const utxos = await SLP.Address.utxo(cashAdresses);
    const utxosFlat = utxos
      .map(el => el.utxos)
      .reduce((a, b) => a.concat(b), [])
      .sort((x, y) => y.ts - x.ts);
    const isSLPUtxo = await SLP.Utils.isTokenUtxo(utxosFlat);
    const bchUtxoIndexes = isSLPUtxo.reduce((a, e, i) => {
      if (!e) a.push(i);
      return a;
    }, []);

    const bchTransactions = await SLP.Transaction.details(
      bchUtxoIndexes.map(el => utxosFlat[el].txid)
    );
    return bchTransactions.slice(0, 30).map(el => ({
      txid: el.txid,
      date: new Date(el.time * 1000),
      confirmations: el.confirmations,
      transactionBalance: (cashAdresses.includes(vin[0].cashAddress) ? -1 : 1) * vout[0].value
    }));
  } catch (e) {
    return null;
  }
};

export default withSLP(getTransactionHistory);
