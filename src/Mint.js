import React, { useState } from "react";
import styled from "styled-components";
import { ButtonQR } from "badger-components-react";
import { WalletContext } from "./badger/context";
import { mintToken } from "./badger/mintToken";
import { Card, Icon, Avatar, Table, Form, Input, Button, Alert, Select, Spin, notification } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";

const InputGroup = Input.Group;
const { Meta } = Card;
const { Option } = Select;

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
  const { wallet, tokens, balances } = ContextValue;
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

    if (
      !formData.baton ||
      !formData.quantity ||
      Number(formData.quantity) <= 0
    ) {
      return;
    }

    setLoading(true);
    const {quantity, baton } = formData;

    try {
      const link = await mintToken(wallet, {
        tokenId: token.tokenId,
        quantity,
        baton,
      });

      notification.success({
        message: "Success",
        description:
        (
          <a href={link} target="_blank">
            <Paragraph>
              Transaction successful. It might take a little bit to show up on your portfolio. 
              You can verify this transaction here: {link}
            </Paragraph>
          </a>
        ),
        duration: 0
      });
      
      onClose();
      setLoading(false);
    } catch (e) {
      let message;

      if(/don't have the minting baton/.test(e.message)) {
        message = e.message;
      } else if(/Invalid BCH address/.test(e.message)) {
        message = 'Invalid BCH address';
      } else {
        message = "Unknown Error, try again later";
      }

      notification.error({
        message: "Error",
        description: message
      });
      console.error(e.message);
      setLoading(false);
    }
  };

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
              <Icon type="printer" theme="filled" /> Mint
            </h2>
          }
          bordered={false}
        >
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
                      Deposit some BCH in order to pay for the transaction that
                      will mint the token
                    </Paragraph>
                  </>
                ) : null}
              </StyledButtonWrapper>
            </Col>
          </Row>
          <Row type="flex">
            <Col span={24}>
              <Form style={{ width: "auto" }}>
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
                    placeholder="quantity"
                    name="quantity"
                    onChange={e => handleChange(e)}
                    required
                    type="number"
                  />
                </Form.Item>
                <Form.Item
                  validateStatus={
                    !formData.dirty && Number(formData.baton) <= 0 ? "error" : ""
                  }
                  help={
                    !formData.dirty && Number(formData.baton) <= 0
                      ? "Should be a valid slp address"
                      : ""
                  }
                >
                  <Input
                    prefix={<Icon type="wallet" />}
                    placeholder="baton (slp address)"
                    name="baton"
                    onChange={e => handleChange(e)}
                    required
                    value={formData.baton}
                    addonAfter={(
                      <Select name="baton" defaultValue="My Address" onChange={value => handleChange({ target: { value, name: 'baton' } })}>
                        <Option value={wallet.slpAddress}>My Address</Option>
                        <Option value="">Other Address</Option>
                      </Select>
                    )}
                  />
                </Form.Item>
                <Alert
                  message={
                    <Text>
                        <Icon type="info-circle" /> &nbsp;
                        <strong>The SLP Address which has the baton has the ability to mint more tokens.</strong>
                    </Text>
                  }
                  type="warning"
                  style={{ marginTop: 4 }}
                />
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
