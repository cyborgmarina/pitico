import SLPSDK from "slp-sdk";

export default callback => {
  let SLPInstance;
  // if (process.env.REACT_APP_NETWORK === `mainnet`)
  SLPInstance = new SLPSDK({
    restURL: `https://rest.bitcoin.com/v2/`
  });
  // else
  //   SLPInstance = new SLPSDK({
  //     restURL: window.localStorage.getItem("restAPI") || `https://trest.bitcoin.com/v2/`
  //   });

  return (...args) => callback(SLPInstance, ...args);
};
