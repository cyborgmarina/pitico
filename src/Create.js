import React, { useEffect } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { ButtonQR } from "badger-components-react";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import { WalletContext } from "./badger/context";
import {
  Input,
  Button,
  notification,
  Spin,
  Icon,
  Row,
  Col,
  Card,
  Form,
  Typography
} from "antd";
import { createToken } from "./badger/createToken";

const { Paragraph, Text } = Typography;

const StyledButtonWrapper = styled.div`
  ${ButtonQR} {
    button {
      display: none;
    }
  }
`;

const Create = ({ history }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, balances, loading: loadingContext } = ContextValue;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    dirty: true,
    tokenName: "",
    tokenSymbol: "",
    amount: ""
  });

  async function handleCreateToken() {
    setData({
      ...data,
      dirty: false
    });

    if (
      !data.tokenName ||
      !data.tokenSymbol ||
      !data.amount ||
      Number(data.amount) <= 0
    ) {
      return;
    }

    setLoading(true);
    const { tokenName, tokenSymbol, amount } = data;
    console.log("data", data);
    try {
      await createToken(wallet, {
        tokenName,
        tokenSymbol,
        qty: amount
      });

      notification.success({
        message: "Success",
        description: "Create Token Success"
      });

      history.push("/");
    } catch (e) {
      let message;
      switch (e.message) {
        case "Transaction has no inputs":
          message = "Insufficient balance";
          break;
        default:
          message = "Unknown Error, try again later";
          break;
      }

      notification.error({
        message: "Error",
        description: message
      });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setData(p => ({ ...p, [name]: value }));
  };

  return (
    <Row justify="center" type="flex">
      <Col span={8}>
        <Spin spinning={loading || loadingContext}>
          <Card
            title={
              <h2>
                <Icon type="plus-square" theme="filled" /> Create
              </h2>
            }
            bordered={false}
          >
            <StyledButtonWrapper>
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
            </StyledButtonWrapper>
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
                validateStatus={!data.dirty && Number(data.amount) <= 0 ? "error" : ""}
                help={
                  !data.dirty && Number(data.amount) <= 0 ? "Should be greater than 0" : ""
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
                <Button onClick={() => handleCreateToken()}>
                  Create Token
                </Button>
              </div>
            </Form>
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default withRouter(Create);
