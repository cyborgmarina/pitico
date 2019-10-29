import withSLP from "./withSLP";

const getTokenInfo = async (SLP, tokenId) => {
  try {
    return await SLP.Utils.list(tokenId);
  } catch (error) {
    console.error(error);
  }
};

export default withSLP(getTokenInfo);
