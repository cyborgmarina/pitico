import React from "react";
import { WalletContext } from "./badger/context";
import { mintToken } from "./badger/mintToken";
import { Card, Icon, Avatar, Table, Form, Input, Button } from "antd";
import { Row, Col } from "antd";

const { Meta } = Card;

const Mint = () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens } = ContextValue;
  const data = {};

  const submit = () => null;
  const handleChange = () => null;

  return (
    <Row justify="center" type="flex">
      <Col span={24}>
        <Card
          title={
            <h2>
              <Icon type="plus-square" theme="filled" /> Create
            </h2>
          }
          bordered={false}
        >
          {/* <StyledButtonWrapper>
              {!loadingContext && !balances.balance ? (
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
                    Deposit some BCH in order to pay for the transaction that will generate the token
                  </Paragraph>
                </>
              ) : null}
            </StyledButtonWrapper> */}
          <Form>
            <Form.Item
              validateStatus={!data.dirty && !data.tokenName ? "error" : ""}
              help={
                !data.dirty && !data.tokenName
                  ? "Should be combination of numbers & alphabets"
                  : ""
              }
            >
              <Input
                placeholder="tokenName"
                name="tokenName"
                onChange={e => handleChange(e)}
                required
              />
            </Form.Item>
            <Form.Item
              validateStatus={!data.dirty && !data.tokenSymbol ? "error" : ""}
              help={
                !data.dirty && !data.tokenSymbol
                  ? "Should be combination of numbers & alphabets"
                  : ""
              }
            >
              <Input
                placeholder="tokenSymbol"
                name="tokenSymbol"
                onChange={e => handleChange(e)}
                required
              />
            </Form.Item>
            <Form.Item
              validateStatus={
                !data.dirty && Number(data.amount) <= 0 ? "error" : ""
              }
              help={
                !data.dirty && Number(data.amount) <= 0
                  ? "Should be greater than 0"
                  : ""
              }
            >
              <Input
                placeholder="quantity"
                name="amount"
                onChange={e => handleChange(e)}
                required
                type="number"
              />
            </Form.Item>
            <div style={{ paddingTop: "12px" }}>
              <Button onClick={() => submit()}>Create Token</Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Mint;
