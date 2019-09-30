import React, { useState } from "react";
import styled from "styled-components";
import { ButtonQR } from "badger-components-react";
import { WalletContext } from "./badger/context";
import { sendDividends, balancesForToken } from "./badger/sendDividends";
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

const PayDividends = ({ token, onClose }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, balances } = ContextValue;
  const [formData, setFormData] = useState({
    dirty: true,
    value: 0,
    tokenId: token.tokenId
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (
      !formData.tokenId ||
      !formData.value ||
      Number(formData.value) <= 0
    ) {
      return;
    }

    setLoading(true);
    const { value, tokenId } = formData;
    try {
      const link = await sendDividends(wallet, {
      	value,
        tokenId: token.tokenId,
      });

      notification.success({
        message: "Success",
        description:
        (
          <a href={link} target="_blank">
            <Paragraph>
              Transaction successful.
              Click or tap here for more details
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
              <Icon type="dollar" /> Pay Dividends
            </h2>
          }
          bordered={false}
        >
                      <Alert
      style={{ marginBottom: "10px" }}
      message={<span><Paragraph><Icon type="warning" /> BE CAREFUL.</Paragraph><Paragraph>This is an <strong>EXPERIMENTAL</strong> feature, strange things may happen.</Paragraph></span>}
      type="warning"
      closable={false}
      />
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
                      Dividends are paid in BCH, deposit some so you can pay dividends to token holders.
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
                    !formData.dirty && Number(formData.value) <= 0 ? "error" : ""
                  }
                  help={
                    !formData.dirty && Number(formData.value) <= 0
                      ? "Should be greater than 0"
                      : ""
                  }
                >
                  <Input
                    prefix={<Icon type="block" />}
                    suffix={<span>BCH</span>}
                    placeholder="e.g: 0.01"
                    name="value"
                    onChange={e => handleChange(e)}
                    required
                    type="number"
                  />
                </Form.Item>
                <div style={{ paddingTop: "12px" }}>
                  <Button onClick={() => submit()}>Pay Dividends</Button>
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

export default PayDividends;
