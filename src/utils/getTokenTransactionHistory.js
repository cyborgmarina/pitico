import withSLP from "./withSLP";

const getTokenTransactionHistory = async (SLP, slpAddress, tokenId) => {
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
          ],
          "slp.detail.tokenIdHex": tokenId
        },
        sort: {
          "blk.t": -1
        },
        limit: 30
      },
      r: {
        f: "[.[] | { txid: .tx.h, tokenDetails: .slp, blk: .blk } ]"
      }
    };

    const calculateTransactionBalance = outputs => {
      if (outputs.length === 1 && outputs[0].address === slpAddress) return outputs[0].amount;
      if (outputs.length > 1 && outputs[outputs.length - 1].address === slpAddress)
        return (
          outputs
            .slice(0, outputs.length - 1)
            .map(element => element.amount)
            .reduce((a, b) => a + b, 0) * -1
        );
      if (outputs.length > 1 && outputs.findIndex(element => element.address === slpAddress))
        return outputs.find(element => element.address === slpAddress).amount;
    };

    const slpDbInstance = SLP.SLPDB;
    const queryResults = await slpDbInstance.get(query);
    const tokenTransactionHistory = {
      confirmed: [],
      unconfirmed: []
    };
    if (queryResults.c.length) {
      tokenTransactionHistory.confirmed = queryResults.c.map(el => ({
        txid: el.txid,
        detail: el.tokenDetails.detail,
        balance: calculateTransactionBalance(el.tokenDetails.detail.outputs),
        date: new Date(Number(el.blk.t) * 1000)
      }));
    }

    if (queryResults.u.length) {
      tokenTransactionHistory.unconfirmed = queryResults.c.map(el => ({
        txid: el.txid,
        detail: el.tokenDetails.detail,
        balance: calculateTransactionBalance(el.tokenDetails.detail.outputs),
        date: null
      }));
    }
    return tokenTransactionHistory;
  } catch (e) {
    return [];
  }
};

export default withSLP(getTokenTransactionHistory);
