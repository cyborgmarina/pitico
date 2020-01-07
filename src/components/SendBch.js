import React, { useState } from "react";
import styled from "styled-components";
import { WalletContext } from "../utils/context";
import { Card, Icon, Form, Input, Button, Spin, notification } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { PlaneIcon } from "./common/CustomIcons";
import { QRCode } from "./QRCode";
import bchLogo from "./bch-logo.png";
import { sendBch, calcFee } from "../utils/sendBch";
import getWalletDetails from "../utils/getWalletDetails";

const StyledButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SendBCH = ({ onClose }) => {
  const { wallet, balances } = React.useContext(WalletContext);
  const [formData, setFormData] = useState({
    dirty: true,
    value: "",
    address: ""
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (!formData.address || !formData.value || Number(formData.value) <= 0) {
      return;
    }

    setLoading(true);
    const { address, value } = formData;

    try {
      const link = await sendBch(getWalletDetails(wallet), {
        addresses: [address],
        values: [value]
      });

      notification.success({
        message: "Success",
        description: (
          <a href={link} target="_blank">
            <Paragraph>Transaction successful. Click or tap here for more details</Paragraph>
          </a>
        ),
        duration: 2
      });

      onClose();
      setLoading(false);
    } catch (e) {
      let message;

      if (/don't have the minting baton/.test(e.message)) {
        message = e.message;
      } else if (/Invalid BCH address/.test(e.message)) {
        message = "Invalid BCH address";
      } else {
        message = `
          Unexpected Error. Cause:
          ${e.message}
        `;
      }

      notification.error({
        message: "Error",
        description: message,
        duration: 2
      });
      console.error(e.message);
      setLoading(false);
    }
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setFormData(p => ({ ...p, [name]: value }));
  };

  const onMax = async () => {
    setLoading(true);
    try {
      const txFee = await calcFee({ wallet });
      let value =
        balances.totalBalance - txFee >= 0 ? (balances.totalBalance - txFee).toFixed(8) : 0;
      setFormData({
        ...formData,
        value
      });
    } catch (err) {}
    setLoading(false);
  };

  return (
    <Row type="flex">
      <Col span={24}>
        <Spin spinning={loading}>
          <Card
            title={
              <h2>
                <PlaneIcon /> Send
              </h2>
            }
            bordered={false}
          >
            <br />
            {!balances.balance && !balances.unconfirmedBalance ? (
              <Row justify="center" type="flex">
                <Col>
                  <StyledButtonWrapper>
                    <>
                      <Paragraph>
                        You currently have 0 BCH. Deposit some funds to use this feature.
                      </Paragraph>
                      <Paragraph>
                        <QRCode id="borderedQRCode" address={wallet.cashAddress} />
                      </Paragraph>
                    </>
                  </StyledButtonWrapper>
                </Col>
              </Row>
            ) : (
              <Row type="flex">
                <Col span={24}>
                  <Form style={{ width: "auto" }}>
                    <Form.Item
                      validateStatus={!formData.dirty && Number(formData.value) <= 0 ? "error" : ""}
                      help={
                        !formData.dirty && Number(formData.value) <= 0
                          ? "Should be greater than 0"
                          : ""
                      }
                    >
                      <Input
                        prefix={<img src={bchLogo} alt="" width={16} height={16} />}
                        name="value"
                        placeholder="value"
                        suffix="BCH"
                        onChange={e => handleChange(e)}
                        required
                        value={formData.value}
                        addonAfter={<Button onClick={onMax}>max</Button>}
                      />
                    </Form.Item>
                    <Form.Item
                      validateStatus={!formData.dirty && !formData.address ? "error" : ""}
                      help={
                        !formData.dirty && !formData.address ? "Should be a valid bch address" : ""
                      }
                    >
                      <Input
                        prefix={<Icon type="wallet" />}
                        placeholder="bch address"
                        name="address"
                        onChange={e => handleChange(e)}
                        required
                      />
                    </Form.Item>
                    <div style={{ paddingTop: "12px" }}>
                      <Button onClick={() => submit()}>Send</Button>
                    </div>
                  </Form>
                </Col>
              </Row>
            )}
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default SendBCH;
