import React, { useState } from "react";
import styled from "styled-components";
import { ButtonQR } from "badger-components-react";
import { WalletContext } from "../../../utils/context";
import mintToken from "../../../utils/broadcastTransaction";
import { Card, Icon, Form, Input, Button, Spin, notification } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { HammerIcon } from "../../Common/CustomIcons";
import { FormItemWithQRCodeAddon } from "../EnhancedInputs";

const StyledButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${ButtonQR} {
    button {
      display: none;
    }
  }
`;

const Mint = ({ token, onClose }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, balances } = ContextValue;
  const [formData, setFormData] = useState({
    dirty: true,
    quantity: 0,
    baton: wallet.slpAddress
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (!formData.baton || !formData.quantity || Number(formData.quantity) <= 0) {
      return;
    }

    setLoading(true);
    const { quantity, baton } = formData;

    try {
      const link = await mintToken(wallet, {
        tokenId: token.tokenId,
        additionalTokenQty: quantity,
        batonReceiverAddress: baton
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
      setLoading(false);
    } catch (e) {
      let message;

      if (/don't have the minting baton/.test(e.message)) {
        message = e.message;
      } else if (/Invalid BCH address/.test(e.message)) {
        message = "Invalid BCH address";
      } else {
        message = e.message;
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

  return (
    <Row type="flex">
      <Col span={24}>
        <Spin spinning={loading}>
          <Card
            title={
              <h2>
                <HammerIcon /> Mint
              </h2>
            }
            bordered={false}
          >
            <br />
            <Row justify="center" type="flex">
              <Col>
                <StyledButtonWrapper>
                  {!balances.balance && !balances.unconfirmedBalance ? (
                    <>
                      <br />
                      <Paragraph>
                        <ButtonQR
                          toAddress={wallet.cashAddress}
                          sizeQR={125}
                          step={"fresh"}
                          amountSatoshis={0}
                        />
                      </Paragraph>
                      <Paragraph style={{ overflowWrap: "break-word" }} copyable>
                        {wallet.cashAddress}
                      </Paragraph>
                      <Paragraph>You currently have 0 BCH.</Paragraph>
                      <Paragraph>
                        Deposit some BCH in order to pay for the transaction that will mint the
                        token
                      </Paragraph>
                    </>
                  ) : null}
                </StyledButtonWrapper>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={24}>
                <Form style={{ width: "auto" }}>
                  <FormItemWithQRCodeAddon
                    validateStatus={!formData.dirty && !formData.baton ? "error" : ""}
                    help={!formData.dirty && !formData.baton ? "Should be a valid slp address" : ""}
                    onScan={result => setFormData({ ...formData, address: result })}
                    inputProps={{
                      placeholder: "Baton (slp address)",
                      name: "baton",
                      onChange: e => handleChange(e),
                      required: true,
                      value: formData.baton
                    }}
                  />
                  <Form.Item
                    validateStatus={
                      !formData.dirty && Number(formData.quantity) <= 0 ? "error" : ""
                    }
                    help={
                      !formData.dirty && Number(formData.quantity) <= 0
                        ? "Should be greater than 0"
                        : ""
                    }
                  >
                    <Input
                      prefix={<Icon type="block" />}
                      placeholder="Amount"
                      name="quantity"
                      onChange={e => handleChange(e)}
                      required
                      type="number"
                    />
                  </Form.Item>
                  <div style={{ paddingTop: "12px" }}>
                    <Button onClick={() => submit()}>Mint</Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default Mint;
