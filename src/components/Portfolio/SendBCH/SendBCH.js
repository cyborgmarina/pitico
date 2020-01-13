import React, { useState } from "react";
import styled from "styled-components";
import { WalletContext } from "../../../utils/context";
import { Card, Icon, Radio, Form, Button, Spin, notification, message } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { PlaneIcon } from "../../Common/CustomIcons";
import { QRCode } from "../../Common/QRCode";
import { sendBch, calcFee, getBCHUtxos, getBalanceFromUtxos } from "../../../utils/sendBch";
import getWalletDetails from "../../../utils/getWalletDetails";
import { FormItemWithMaxAddon, FormItemWithQRCodeAddon } from "../EnhancedInputs";
import getTransactionHistory from "../../../utils/getTransactionHistory";
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
  const [action, setAction] = useState("send");
  const [history, setHistory] = useState(null);

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
      const link = await sendBch((getWalletDetails(wallet) || {}).Bip44, {
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

  const getBchHistory = async () => {
    setLoading(true);
    try {
      const resp = await getTransactionHistory(wallet.cashAdresses, [
        balances.bitcoinCashBalance[0].transactions,
        balances.bitcoinCashBalance[1].transactions,
        balances.bitcoinCashBalance[2].transactions
      ]);
      console.log("history :", resp);
      setHistory(resp);
    } catch (err) {
      const message = err.message;

      notification.error({
        message: "Error",
        description: message,
        duration: 2
      });
      console.error(err.message);
    }

    setLoading(false);
  };

  const handleChangeAction = () => {
    if (action === "send") {
      setAction("history");
      getBchHistory();
    } else {
      setAction("send");
    }
  };

  return (
    <Row type="flex">
      <Col span={24}>
        <Spin spinning={loading}>
          <Card
            title={
              <Radio.Group
                defaultValue="send"
                onChange={() => handleChangeAction()}
                value={action}
                style={{ width: "100%", textAlign: "center", marginTop: 0 }}
                size="small"
                buttonStyle="solid"
              >
                <Radio.Button
                  style={{
                    borderRadius: "19.5px",
                    height: "40px",
                    width: "50%",
                    fontSize: "16px"
                  }}
                  value="send"
                  onClick={() => handleChangeAction()}
                >
                  <PlaneIcon style={{ color: "#fff" }} /> Send
                </Radio.Button>
                <Radio.Button
                  style={{
                    borderRadius: "19.5px",
                    height: "40px",
                    width: "50%",
                    fontSize: "16px"
                  }}
                  value="history"
                  onClick={() => handleChangeAction()}
                >
                  <Icon style={{ color: "#fff" }} type="history" /> History
                </Radio.Button>
              </Radio.Group>
            }
            bordered={false}
          >
            <br />

            {!balances.balance && !balances.unconfirmedBalance && action === "send" ? (
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
              (action === "send" && (
                <Row type="flex">
                  <Col span={24}>
                    <Form style={{ width: "auto" }}>
                      <FormItemWithMaxAddon
                        validateStatus={
                          !formData.dirty && Number(formData.value) <= 0 ? "error" : ""
                        }
                        help={
                          !formData.dirty && Number(formData.value) <= 0
                            ? "Should be greater than 0"
                            : ""
                        }
                        onMax={onMax}
                        inputProps={{
                          name: "value",
                          placeholder: "value",
                          suffix: "BCH",
                          onChange: e => handleChange(e),
                          required: true,
                          value: formData.value
                        }}
                      />
                      <FormItemWithQRCodeAddon
                        validateStatus={!formData.dirty && !formData.address ? "error" : ""}
                        help={
                          !formData.dirty && !formData.address
                            ? "Should be a valid bch address"
                            : ""
                        }
                        onScan={result => setFormData({ ...formData, address: result })}
                        inputProps={{
                          placeholder: "bch address",
                          name: "address",
                          onChange: e => handleChange(e),
                          required: true,
                          value: formData.address
                        }}
                      />
                      <div style={{ paddingTop: "12px" }}>
                        <Button onClick={() => submit()}>Send</Button>
                      </div>
                    </Form>
                  </Col>
                </Row>
              )) ||
              (!loading && action === "history" && (history || {}).bchTransactions && (
                <>
                  {history.bchTransactions.map(el => (
                    <>
                      <h3>{el.transactionBalance > 0 ? "Received" : "Sent"}</h3>
                      <p>{el.txid}</p>
                      <p>{el.transactionBalance}</p> <p>{el.date.toLocaleString()}</p>{" "}
                      <p>{el.confirmations}</p>
                    </>
                  ))}
                </>
              ))
            )}
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default SendBCH;
