import withSLP from "./withSLP";
import isBatonHolder from "./isBatonHolder";

const getTokenInfo = async (SLP, slpAddress, tokenId) => {
  try {
    const info = await SLP.Utils.list(tokenId);
    info.hasBaton = await isBatonHolder(slpAddress, tokenId);
    return info;
  } catch (error) {
    console.error(error);
  }
};

export default withSLP(getTokenInfo);
