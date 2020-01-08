import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { ButtonQR } from "badger-components-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { WalletContext } from "../../utils/context";
import { Input, Button, notification, Spin, Icon, Row, Col, Card, Form, Typography } from "antd";
import { QRCode } from "../Common/QRCode";

const { Paragraph, Text } = Typography;

export const OnBoarding = ({ history }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, balance, createWallet } = ContextValue;
  const [formData, setFormData] = useState({
    dirty: true,
    mnemonic: ""
  });

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (!formData.mnemonic) {
      return;
    }

    createWallet(formData.mnemonic);
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setFormData(p => ({ ...p, [name]: value }));
  };

  return (
    <Row gutter={8} justify="center" type="flex">
      <Col lg={8} span={24} style={{ marginTop: 8 }}>
        <Card
          title={
            <h2>
              <Icon type="plus-square" theme="filled" /> New Wallet
            </h2>
          }
          style={{ height: "100%" }}
          bordered={false}
        >
          <div style={{}}>
            <Button onClick={() => createWallet()}>Create</Button>
          </div>
        </Card>
      </Col>
      <Col lg={8} span={24} style={{ marginTop: 8 }}>
        <Card
          title={
            <h2>
              <Icon type="import" /> Import Wallet
            </h2>
          }
          bordered={false}
        >
          <Form style={{ width: "auto" }}>
            <Form.Item
              validateStatus={!formData.dirty && !formData.mnemonic ? "error" : ""}
              help={!formData.dirty && !formData.mnemonic ? "Should not be empty" : ""}
            >
              <Input
                prefix={<Icon type="lock" />}
                placeholder="mnemonic"
                name="mnemonic"
                onChange={e => handleChange(e)}
                required
              />
            </Form.Item>
            <div style={{ paddingTop: "12px" }}>
              <Button onClick={() => submit()}>Import</Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
