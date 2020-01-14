import withSLP from "./withSLP";

const getTokensBalance = async (SLP, slpAddresses) => {
  try {
    const query = {
      v: 3,
      q: {
        aggregate: [
          {
            $match: {
              "graphTxn.outputs": {
                $elemMatch: {
                  address: { $in: slpAddresses },
                  status: "UNSPENT",
                  slpAmount: { $gte: 0 }
                }
              }
            }
          },
          { $unwind: "$graphTxn.outputs" },
          {
            $project: {
              amount: "$graphTxn.outputs.slpAmount",
              address: "$graphTxn.outputs.address",
              txid: "$graphTxn.txid",
              vout: "$graphTxn.outputs.vout",
              tokenId: "$tokenDetails.tokenIdHex",
              out: "$graphTxn.outputs",
              isTokenBalance: {
                $cond: [
                  {
                    $and: [
                      { $in: ["$graphTxn.outputs.address", slpAddresses] },
                      { $eq: ["$graphTxn.outputs.status", "UNSPENT"] },
                      { $gte: ["$graphTxn.outputs.slpAmount", 0] }
                    ]
                  },
                  "$graphTxn.outputs.slpAmount",
                  0
                ]
              },
              isSatoshiBalance: {
                $cond: [
                  {
                    $and: [
                      { $in: ["$graphTxn.outputs.address", slpAddresses] },
                      { $eq: ["$graphTxn.outputs.status", "UNSPENT"] },
                      { $gte: ["$graphTxn.outputs.slpAmount", 0] }
                    ]
                  },
                  "$graphTxn.outputs.bchSatoshis",
                  0
                ]
              }
            }
          },
          {
            $group: {
              _id: "$tokenId",
              tokenId: { $first: "$tokenId" },
              balance: { $sum: "$isTokenBalance" },
              satoshisBalance: { $sum: "$isSatoshiBalance" },
              adresses: { $addToSet: "$address" },
              outputs: { $addToSet: "$out" }
            }
          }
        ]
      }
    };

    const slpDbInstance = SLP.SLPDB;
    const queryResult = await slpDbInstance.get(query);
    const result = queryResult.g;

    const totalTokensBalance = result.map(el => {
      const adresses = el.adresses.filter(e => slpAddresses.includes(e));
      el.tokenBalanceByAddress = Array.from({ length: adresses.length });
      adresses.forEach((slpAddress, index) => {
        const balanceByAddress = el.outputs.reduce((prev, cur) => {
          if (cur.address === slpAddress) return prev + cur.slpAmount;
          return prev;
        }, 0);

        const satoshisBalanceByAddress = el.outputs.reduce((prev, cur) => {
          if (cur.address === slpAddress) return prev + cur.satoshisBalance;
          return prev;
        }, 0);
        el.tokenBalanceByAddress[index] = {
          slpAddress,
          balanceByAddress,
          satoshisBalanceByAddress
        };
      });
      el.adresses = adresses;
      return el;
    });

    return totalTokensBalance;
  } catch (e) {
    throw e;
  }
};

export default withSLP(getTokensBalance);
