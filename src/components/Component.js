import React from "react";
import { utilsButton, utilsBadge } from "badger-components-react";

const Example = props => {
  // eatBCH bitcoin cash address
  const toAddress = "bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g";

  // Random SLP address
  const toSLPAddress = "simpleledger:qq6qcjt6xlkeqzdwkhdvfyl2q2d2wafkgg8phzcqez";

  // tokenId
  const nakamotoID = "df808a41672a0a0ae6475b44f272a107bc9961b90f29dc918d71301f24fe92fb";

  return (
    <>
      {/* Minimal Examples */}
      <utilsBadge to={toAddress} price={0.5} currency="USD" />
      <utilsButton to={toAddress} price={1} currency="JPY" />

      {/* Price in bch */}
      <utilsBadge to={toAddress} amount={0.01} coinType="BCH" />
      <utilsButton to={toAddress} amount={0.0001} coinType="BCH" />

      {/* Price in SLP tokens - NAKAMOTO in this example */}
      <utilsBadge to={toSLPAddress} amount={5.01} coinType="SLP" tokenId={nakamotoID} />
      <utilsButton to={toSLPAddress} amount={2.0001} coinType="SLP" tokenId={nakamotoID} />

      {/* More Complex Examples, pricing in fiat */}
      <utilsBadge
        price={0.001} // Price in currency
        currency="CAD" // Currency to convert from
        to="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g" // Payment address
        opReturn={["0x6d02", "Hello badger-components-react"]}
        tag="utils Pay" // Text on button
        text="Payment Total" // Text at top of badge
        showBrand // Show link to utils website
        showAmount // Show BCH satoshi amount
        showQR // Intent to show QR if transaction is URI encodeable
        successFn={() => console.log("Payment success callback")}
        failFn={() => console.warn("Payment failed or cancelled callback")}
      />

      <utilsButton
        price={0.003}
        currency="USD"
        to="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g"
        opReturn={["0x6d02", "Hello badger-components-react"]}
        text="utils Pay"
        showAmount
        showBorder
        showQR
        successFn={() => console.log("success example function called")}
        failFn={() => console.log("fail example function called")}
      />

      {/* Pricing in BCH */}
      <utilsBadge
        amount={0.001} // Amount in crypto
        coinType="BCH" // Defaults to BCH
        to="bitcoincash:pp8skudq3x5hzw8ew7vzsw8tn4k8wxsqsv0lt0mf3g" // Payment address
        isRepeatable // Reset to fresh state after a few seconds
        repeatTimeout={4000} // time in ms to reset button after payment
        watchAddress // Watch all payments to address
      />
    </>
  );
};

export default Example;
