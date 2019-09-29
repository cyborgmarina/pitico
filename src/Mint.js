import React, { useState } from "react";
import styled from 'styled-components';
import { ButtonQR } from "badger-components-react";
import { WalletContext } from "./badger/context";
import { mintToken } from "./badger/mintToken";
import { Card, Icon, Avatar, Table, Form, Input, Button } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
const { Meta } = Card;

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

const Mint = () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, balances } = ContextValue;
  const [formData, setFormData] = useState({
    dirty: true,
    quantity: 0,
    baton: wallet.slpAddress
  });

  const submit = () => null;

  const handleChange = e => {
    const { value, name } = e.target;

    setFormData(p => ({ ...p, [name]: value }));
  };

  return (
    <Row justify="center" type="flex">
      <Col span={24}>
        <Card
          title={
            <h2>
              <Icon type="printer" theme="filled" /> Mint
            </h2>
          }
          bordered={false}
        >
          <Row justify="center" type="flex">
            <Col span={24}>
              <StyledButtonWrapper>
                  {balances.balance ? (
                    <>
                      <Paragraph>
                        <ButtonQR
                          toAddress={wallet.cashAddress}
                          sizeQR={125}
                          step={"fresh"}
                          amountSatoshis={0}
                        />
                      </Paragraph>
                      <Paragraph style={{ overflowWrap: 'break-word' }}copyable>{wallet.cashAddress}</Paragraph>
                      <Paragraph>
                        You currently have 0 BCH. 
                      </Paragraph>
                      <Paragraph>
                        Deposit some BCH in order to pay for the transaction that will mint the token
                      </Paragraph>
                    </>
                  ) : null}
                </StyledButtonWrapper>
            </Col>
          </Row>
          <Form style={{ width: 'auto' }}>
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
                  ? "Should be greater than 0"
                  : 'The slp address which has the baton has the ability to mint more tokens.'
              }
            >
              <Input
                prefix={<Icon type="wallet" />}
                placeholder="baton"
                name="baton"
                onChange={e => handleChange(e)}
                required
                value={formData.baton}
              />
            </Form.Item>
            <div style={{ paddingTop: "12px" }}>
              <Button onClick={() => submit()}>Mint Token</Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Mint;
