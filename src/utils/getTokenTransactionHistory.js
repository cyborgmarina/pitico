import withSLP from "./withSLP";

const getTokenTransactionHistory = async (SLP, slpAdresses, tokenId) => {
  try {
    const query = {
      v: 3,
      q: {
        db: ["c", "u"],
        find: {
          $or: [
            {
              "in.e.a": { $in: slpAdresses }
            },
            {
              "out.e.a": { $in: slpAdresses }
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
      if (outputs.length === 1 && slpAdresses.includes(outputs[0].address))
        return +outputs[0].amount;
      if (outputs.length === 1 && !slpAdresses.includes(outputs[0].address))
        return +outputs[0].amount * -1;
      if (outputs.length > 1 && slpAdresses.includes(outputs[outputs.length - 1].address))
        return (
          outputs
            .slice(0, outputs.length - 1)
            .map(element => +element.amount)
            .reduce((a, b) => a + b, 0) * -1
        );
      if (
        outputs.length > 1 &&
        outputs.findIndex(element => slpAdresses.includes(element.address)) !== -1
      )
        return +outputs.find(element => slpAdresses.includes(element.address)).amount;
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
        date: new Date(Number(el.blk.t) * 1000),
        confirmed: true
      }));
    }

    if (queryResults.u.length) {
      tokenTransactionHistory.unconfirmed = queryResults.c.map(el => ({
        txid: el.txid,
        detail: el.tokenDetails.detail,
        balance: calculateTransactionBalance(el.tokenDetails.detail.outputs),
        date: new Date(),
        confirmed: false
      }));
    }
    const { confirmed, unconfirmed } = tokenTransactionHistory;
    return unconfirmed.concat(confirmed);
  } catch (e) {
    throw e;
  }
};

export default withSLP(getTokenTransactionHistory);
