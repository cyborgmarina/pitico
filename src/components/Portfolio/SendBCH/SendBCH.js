import React, { useState } from "react";
import styled from "styled-components";
import { WalletContext } from "../../../utils/context";
import { Card, Form, Button, Spin, notification, message } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { PlaneIcon } from "../../Common/CustomIcons";
import { QRCode } from "../../Common/QRCode";
import { sendBch, calcFee, getBCHUtxos, getBalanceFromUtxos } from "../../../utils/sendBch";
import getWalletDetails from "../../../utils/getWalletDetails";
import { FormItemWithMaxAddon, FormItemWithQRCodeAddon } from "../EnhancedInputs";
import { retry } from "../../../utils/retry";

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
          <a href={link} target="_blank" rel="noopener noreferrer">
            <Paragraph>Transaction successful. Click or tap here for more details</Paragraph>
          </a>
        ),
        duration: 2
      });

      onClose();
    } catch (e) {
      const message = e.message;

      notification.error({
        message: "Error",
        description: message,
        duration: 2
      });
      console.error(e.message);
    }

    setLoading(false);
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setFormData(p => ({ ...p, [name]: value }));
  };

  const onMax = async () => {
    setLoading(true);
    try {
      const utxos = await retry(() => getBCHUtxos(wallet.cashAddress));
      const totalBalance = getBalanceFromUtxos(utxos);
      const txFee = await calcFee(utxos);
      let value = totalBalance - txFee >= 0 ? (totalBalance - txFee).toFixed(8) : 0;
      setFormData({
        ...formData,
        value
      });
    } catch (err) {
      message.error("Unable to calculate the max value due to network errors");
    }
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
                    <FormItemWithQRCodeAddon
                      validateStatus={!formData.dirty && !formData.address ? "error" : ""}
                      help={
                        !formData.dirty && !formData.address ? "Should be a valid bch address" : ""
                      }
                      onScan={result => setFormData({ ...formData, address: result })}
                      inputProps={{
                        placeholder: "BCH Address",
                        name: "address",
                        onChange: e => handleChange(e),
                        required: true,
                        value: formData.address
                      }}
                    />
                    <FormItemWithMaxAddon
                      validateStatus={!formData.dirty && Number(formData.value) <= 0 ? "error" : ""}
                      help={
                        !formData.dirty && Number(formData.value) <= 0
                          ? "Should be greater than 0"
                          : ""
                      }
                      onMax={onMax}
                      inputProps={{
                        name: "value",
                        placeholder: "Amount",
                        suffix: "BCH",
                        onChange: e => handleChange(e),
                        required: true,
                        value: formData.value
                      }}
                    />
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
