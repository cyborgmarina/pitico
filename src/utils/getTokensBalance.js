import withSLP from "./withSLP";

const getTokensBalance = async (SLP, slpAdresses) => {
  try {
    const query = {
      v: 3,
      q: {
        db: ["a"],
        find: {
          address: { $in: slpAdresses },
          token_balance: { $gte: 0 }
        },
        limit: 10000
      },
      r: {
        f:
          "[.[] | { tokenId: .tokenDetails.tokenIdHex, address: .address,  satoshisBalance: .satoshis_balance, balance: .token_balance }]"
      }
    };

    const slpDbInstance = SLP.SLPDB;
    const queryResult = await slpDbInstance.get(query);
    return queryResult.a.reduce((a, e) => {
      const tokenId = e.tokenId,
        found = a.find(el => el.tokenId === tokenId);
      if (found) {
        found.satoshisBalance += e.satoshisBalance;
        found.balance = (+found.balance + +e.balance).toString();
        found.address = [found.address, e.address].reduce(
          (acc, element) => acc.concat(element),
          []
        );
      } else a.push(e);
      return a;
    }, []);
  } catch (e) {
    return null;
  }
};

export default withSLP(getTokensBalance);
