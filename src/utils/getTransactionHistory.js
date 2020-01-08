import withSLP from "./withSLP";

const getTransactionHistory = async (SLP, adresses) => {
  try {
    const utxos = await SLP.Address.utxo(adresses);
    const utxosFlat = utxos
      .map(el => el.utxos)
      .reduce((a, b) => a.concat(b), [])
      .sort((x, y) => y.ts - x.ts);
    const isSLPUtxo = await SLP.Utils.isTokenUtxo(utxosFlat);
    const bchUtxo = isSLPUtxo.reduce((a, e, i) => {
      if (!e) a.push(i);
      return a;
    }, []);

    const bchTransactions = await SLP.Transaction.details(bchUtxo.map(el => isSLPUtxo[el].txid));
    return bchTransactions.slice(0, 30);
  } catch (e) {
    return null;
  }
};

export default withSLP(getTransactionHistory);
