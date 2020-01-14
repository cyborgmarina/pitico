import React, { useState } from "react";
import styled from "styled-components";
import RawQRCode from "qrcode.react";
import slpLogo from "../../assets/slp-qrcode.png";
import bchLogo from "../../assets/bch-qrcode.png";
import { QRCode as BrandesQRCode } from "react-qrcode-logo";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Popover } from "antd";

export const StyledRawQRCode = styled(RawQRCode)`
  cursor: pointer;
`;

const AddrHolder = styled.textarea`
  font-size: 12px;
  line-height: 14px;
  resize: none;
  width: 209px;
  border-radius: 5px;
  margin-top: 12px;
  color: black;
  padding: 10px 16px 0px 16px;
  height: 50px;
`;

export const QRCode = ({ address, size = 210, onClick = () => null, ...otherProps }) => {
  const [visible, setVisible] = useState(false);

  const handleOnClick = evt => {
    setVisible(true);
    setTimeout(() => setVisible(false), 3000);
    onClick(evt);
  };

  const handleOnCopy = () => {
    document.getElementById("copyTxtArea").select();
  };

  return (
    <Popover content="copied!" visible={visible}>
      <CopyToClipboard style={{ overflow: "auto" }} text={address} onCopy={handleOnCopy}>
        {/* <RawQRCode onClick={handleOnClick} value={address || ""} size={size} {...otherProps} /> */}
        <div style={{ overflow: "auto" }} onClick={handleOnClick}>
          <BrandesQRCode
            id="borderedQRCode"
            // style={{ border: "20px solid #fff", borderRadius: "8px" }}

            logoWidth={64}
            logoHeight={64}
            value={address || ""}
            size={size}
            logoImage={address && address.includes("bitcoin") ? bchLogo : slpLogo}
            {...otherProps}
          />
        </div>
      </CopyToClipboard>
      <AddrHolder id="copyTxtArea" rows="2" readOnly value={address} />
    </Popover>
  );
};
