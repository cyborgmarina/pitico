import withSLP from "./withSLP";

const getTransactionHistory = async (SLP, cashAddresses, transactions) => {
  try {
    const query = (cashAddress, qty) => ({
      v: 3,
      q: {
        db: ["c", "u"],
        find: {
          $or: [
            {
              "in.e.a": SLP.Address.toSLPAddress(cashAddress)
            },
            {
              "out.e.a": SLP.Address.toSLPAddress(cashAddress)
            }
          ]
        },
        sort: {
          "blk.i": -1
        },
        limit: qty
      },
      r: {
        f: "[.[] | { txid: .tx.h } ]"
      }
    });

    const nonZeroIndexes = transactions.reduce((a, e, i) => {
      if (e.length > 0) a.push(i);
      return a;
    }, []);

    const queryResults = Array.from({ length: nonZeroIndexes.length });
    const slpDbInstance = SLP.SLPDB;

    for (let i = 0; i < nonZeroIndexes.length; i++) {
      const el = nonZeroIndexes[i];
      queryResults[i] = await slpDbInstance.get(query(cashAddresses[el], transactions[el].length));
    }

    const tokensTxIds = queryResults.map(el => el.c.concat(el.u).map(tx => tx.txid));

    const bchTxIds = Array.from({ length: nonZeroIndexes.length });
    nonZeroIndexes.forEach((e, i) => {
      bchTxIds[i] = transactions[e].filter(el => !tokensTxIds[e].includes(el));
    });

    let bchTransactions = [];

    for (let i = 0; i < nonZeroIndexes.length; i++) {
      const e = nonZeroIndexes[i];
      if (transactions[e].length < 11)
        bchTransactions = [...bchTransactions, ...(await SLP.Transaction.details(bchTxIds[i]))];

      if (transactions[e].length > 10 && transactions[e].length < 21)
        bchTransactions = [
          ...bchTransactions,
          ...(await SLP.Transaction.details(bchTxIds[i].slice(0, 10))),
          ...(await SLP.Transaction.details(bchTxIds[i].slice(10, bchTxIds[i].length)))
        ];

      if (transactions[e].length > 20)
        bchTransactions = [
          ...bchTransactions,
          ...(await SLP.Transaction.details(bchTxIds[i].slice(0, 10))),
          ...(await SLP.Transaction.details(bchTxIds[i].slice(10, 20))),
          ...(await SLP.Transaction.details(bchTxIds[i].slice(20, 30)))
        ];
    }

    return {
      bchTransactions: bchTransactions
        .reduce((a, b) => a.concat(b), [])
        .sort((x, y) => y.time - x.time)
        .map(el => ({
          txid: el.txid,
          date: new Date(el.time * 1000),
          confirmations: el.confirmations,
          transactionBalance:
            (cashAddresses.includes(el.vin[0].cashAddress) ? -1 : 1) * el.vout[0].value
        })),
      wallets: nonZeroIndexes.map(el => cashAddresses[el])
    };
  } catch (e) {
    console.log("error :", e);
    return [];
  }
};

export default withSLP(getTransactionHistory);
