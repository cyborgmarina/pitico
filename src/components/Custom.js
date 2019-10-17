import React from "react";
import { utilsBase, formatAmount } from "utils-react-components";

import styled from "styled-components";

const CoolButton = styled.button`
  background-color: rebeccapurple;
  color: lime;
  border-radius: 24px;
`;

const MyButton = props => {
  const {
    handleClick,
    to,
    step,

    price,
    currency,

    coinType,
    coinDecimals,
    coinSymbol,
    amount,

    showQR,

    isRepeatable,
    repeatTimeout,
    watchAddress
  } = props;

  return (
    <div>
      <h3>
        Donate {price}
        {currency} to {to}
      </h3>
      <h4>Satoshis: {formatAmount(amount, coinDecimals)}</h4>
      <CoolButton onClick={handleClick}>Custom looking button with render</CoolButton>
    </div>
  );
};

// Wrap with utilsBase higher order component
export default utilsBase(MyButton);
