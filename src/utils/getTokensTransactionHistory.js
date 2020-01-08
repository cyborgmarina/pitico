import withSLP from "./withSLP";

const getTokensTransactionHistory = async (SLP, slpAddress, tokenIds) => {
  try {
    const query = {
      v: 3,
      q: {
        db: ["c", "u"],
        find: {
          $or: [
            {
              "in.e.a": slpAddress
            },
            {
              "out.e.a": slpAddress
            }
          ]
        },
        sort: {
          "blk.i": -1
        },
        limit: 100
      },
      r: {
        f: "[.[] | { txid: .tx.h, tokenDetails: .slp, blk: .blk } ]"
      }
    };
    const slpDbInstance = SLP.SLPDB;
    const queryResults = await slpDbInstance.get(query);
    const queryResultsForGenesisTransaction = await SLP.Transaction.details(
      queryResults.t
        .filter(t => t.mintBatonUtxo && t.mintBatonUtxo.replace(":2", ""))
        .map(t => t.mintBatonUtxo.replace(":2", ""))
    );
    return tokenIds.map((r, i) => ({
      ...queryResults.t[i].tokenDetails
    }));
  } catch (e) {
    return [];
  }
};

export default withSLP(getTokensTransactionHistory);
