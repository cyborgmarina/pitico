import withSLP from "./withSLP";

const getTokensBchBalance = async (SLP, slpAddress) => {
  try {
    const query = {
      v: 3,
      q: {
        db: ["a"],
        find: {
          address: slpAddress,
          token_balance: { $gte: 0 }
        },
        limit: 10000
      },
      r: {
        f:
          "[.[] | { tokenId: .tokenDetails.tokenIdHex, satoshis_balance: .satoshis_balance, token_balance: .token_balance }]"
      }
    };

    const slpDbInstance = SLP.SLPDB;
    const queryResults = await slpDbInstance.get(query);
    const equivalentBchBalance = queryResults.a.length
      ? queryResults.a.map(el => el.satoshis_balance).reduce((a, b) => a + b, 0) * 1e-8
      : 0;
    return equivalentBchBalance;
  } catch (e) {
    return 0;
  }
};

export default withSLP(getTokensBchBalance);
