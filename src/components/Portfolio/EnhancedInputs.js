import * as React from "react";
import { Form, Input, Icon } from "antd";
import styled from "styled-components";
import bchLogo from "../../assets/bch-logo-2.png";
import { ScanQRCode } from "./ScanQRCode";

export const InputAddonText = styled.span`
  width: 100%;
  height: 100%;
  display: block;
`;

export const FormItemWithMaxAddon = ({ onMax, inputProps, ...otherProps }) => {
  return (
    <Form.Item {...otherProps}>
      <Input
        prefix={<img src={bchLogo} alt="" width={16} height={16} />}
        addonAfter={<InputAddonText onClick={onMax}>max</InputAddonText>}
        {...inputProps}
      />
    </Form.Item>
  );
};

export const FormItemWithQRCodeAddon = ({ onScan, inputProps, ...otherProps }) => {
  return (
    <Form.Item {...otherProps}>
      <Input
        prefix={<Icon type="wallet" />}
        addonAfter={<ScanQRCode delay={300} onScan={onScan} />}
        {...inputProps}
      />
    </Form.Item>
  );
};
