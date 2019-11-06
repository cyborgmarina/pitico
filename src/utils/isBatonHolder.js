import withSLP from "./withSLP";

const isBatonHolder = async (SLP, slpAddress, tokenId) => {
  try {
    const query = {
      q: {
        find: {
          "tokenDetails.tokenIdHex": tokenId,
          "tokenDetails.transactionType": "GENESIS"
        },
        limit: 1
      },
      v: 3
    };
    const slpDbInstance = SLP.SLPDB;
    const queryResults = await slpDbInstance.get(query);
    const queryResultsForGenesisTransaction = await SLP.Transaction.details([
      queryResults.t[0].mintBatonUtxo.replace(":2", "")
    ]);
    return (
      SLP.Address.toSLPAddress(queryResultsForGenesisTransaction[0].vin[0].cashAddress) ===
      slpAddress
    );
  } catch (e) {
    return false;
  }
};

export default withSLP(isBatonHolder);
