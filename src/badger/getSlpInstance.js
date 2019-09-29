import SLPSDK from "slp-sdk";
export default network => {
let SLPInstance;
if (network === `mainnet`)
		SLPInstance = new SLPSDK({ restURL: window.localStorage.getItem('restAPI') || `https://rest.bitcoin.com/v2/` });
	else 
		SLPInstance = new SLPSDK({ restURL: window.localStorage.getItem('restAPI') || `https://trest.bitcoin.com/v2/` });
return SLPInstance;
}