import React, { useState } from "react";
import "./App.css";
import styled from "styled-components";
import RawQRCode from "qrcode.react";
import logo from "./slp-oval.png";
import { QRCode as BrandesQRCode } from "react-qrcode-logo";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Popover } from "antd";

export const StyledRawQRCode = styled(RawQRCode)`
  cursor: pointer;
`;

export const QRCode = ({ address, size = 210, onClick = () => null, ...otherProps }) => {
  const [visible, setVisible] = useState(false);

  const handleOnClick = evt => {
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
    onClick(evt);
  };

  return (
    <Popover content="copied!" visible={visible}>
      <CopyToClipboard text={address}>
        {/* <RawQRCode onClick={handleOnClick} value={address || ""} size={size} {...otherProps} /> */}
        <BrandesQRCode
          id="borderedQRCode"
          // style={{ border: "20px solid #fff", borderRadius: "8px" }}
          onClick={handleOnClick}
          logoWidth={73}
          logoHeight={73}
          value={address || ""}
          size={size}
          logoImage={logo}
          {...otherProps}
        />
      </CopyToClipboard>
    </Popover>
  );
};
