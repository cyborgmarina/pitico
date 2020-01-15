import React, { useState } from "react";
import { WalletContext } from "../../utils/context";
import { Input, Button, Icon, Row, Col, Card, Form } from "antd";
import StyledOnboarding from "../Common/StyledPage";

export const OnBoarding = ({ history }) => {
  const ContextValue = React.useContext(WalletContext);
  const { createWallet } = ContextValue;
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
    <StyledOnboarding>
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
              <Button className="bitcoincom-mint-create-wallet" onClick={() => createWallet()}>
                Create
              </Button>
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
              <p>
                <em>Only 245' path is currently supported for wallet imports.</em>
              </p>
              <div style={{ paddingTop: "12px" }}>
                <Button className="bitcoincom-mint-import-wallet" onClick={() => submit()}>
                  Import
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row gutter={8} justify="center" type="flex">
        <Col lg={8} span={24} style={{ marginTop: 8 }}>
          <Card
            title={
              <h2>
                <Icon type="warning" theme="filled" /> Web Wallets
              </h2>
            }
            style={{ height: "100%" }}
            bordered={false}
          >
            <div style={{}}>
              <p>
                Bitcoin.com Mint is an{" "}
                <a
                  href="https://github.com/Bitcoin-com/mint/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  open source,
                </a>{" "}
                non-custodial web wallet supporting SLP and BCH.{" "}
              </p>
              <p>
                {" "}
                Web wallets offer user convenience, but storing large amounts of money on a web
                wallet is not recommended.
              </p>
              <p>Creating your own SLP tokens only costs a few cents worth of BCH.</p>
            </div>
          </Card>
        </Col>
      </Row>
    </StyledOnboarding>
  );
};
