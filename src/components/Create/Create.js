import React from "react";
import { withRouter } from "react-router-dom";
import { WalletContext } from "../../utils/context";
import { Input, Button, notification, Spin, Icon, Row, Col, Card, Form, Typography } from "antd";
import createToken from "../../utils/broadcastTransaction";
import StyledCreate from "../Common/StyledPage";
import { QRCode } from "../Common/QRCode";

const { Paragraph } = Typography;

const Create = ({ history }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, balances, loading: loadingContext } = ContextValue;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    dirty: true,
    tokenName: "",
    tokenSymbol: "",
    documentHash: "",
    decimals: "",
    documentUri: "",
    amount: ""
  });

  async function handleCreateToken() {
    setData({
      ...data,
      dirty: false
    });

    // blank entry for decimals should be 0
    if (data.decimals === "") {
      data.decimals = 0;
    }

    if (
      !data.tokenName ||
      !data.tokenSymbol ||
      !data.amount ||
      Number(data.amount) <= 0 ||
      (data.decimals !== "" && data.decimals < 0) ||
      (data.decimals !== "" && data.decimals > 9) ||
      (data.decimals !== "" && data.decimals % 1 !== 0)
    ) {
      return;
    }

    setLoading(true);
    const { tokenName, tokenSymbol, documentHash, documentUri, amount, decimals } = data;
    try {
      const docUri = documentUri || "developer.bitcoin.com";
      const link = await createToken(wallet, {
        name: tokenName,
        symbol: tokenSymbol,
        documentHash,
        decimals,
        docUri,
        initialTokenQty: amount
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
    } catch (e) {
      let message;
      switch (e.message) {
        case "Transaction has no inputs":
          message = "Insufficient balance";
          break;
        case "Document hash must be provided as a 64 character hex string":
          message = e.message;
          break;
        default:
          message = "Unknown Error, try again later";
          break;
      }

      notification.error({
        message: "Error",
        description: message,
        duration: 2
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
    <StyledCreate>
      <Row justify="center" type="flex">
        <Col lg={8} span={24}>
          <Spin spinning={loading || loadingContext}>
            <Card
              title={
                <h2>
                  <Icon type="plus-square" theme="filled" /> Create Token
                </h2>
              }
              bordered={true}
            >
              <div>
                {!loadingContext && !balances.balance && !balances.unconfirmedBalance ? (
                  <>
                    <Paragraph>
                      <QRCode id="borderedQRCode" address={wallet && wallet.cashAddress} />
                    </Paragraph>
                    <Paragraph>You currently have 0 BCH.</Paragraph>
                    <Paragraph>
                      Deposit some BCH in order to pay for the transaction that will generate the
                      token
                    </Paragraph>
                  </>
                ) : null}
              </div>
              <Form>
                <Form.Item
                  validateStatus={!data.dirty && !data.tokenSymbol ? "error" : ""}
                  help={
                    !data.dirty && !data.tokenSymbol
                      ? "Should be combination of numbers & alphabets"
                      : ""
                  }
                >
                  <Input
                    placeholder="token symbol e.g.: PTC"
                    name="tokenSymbol"
                    onChange={e => handleChange(e)}
                    required
                  />
                </Form.Item>
                <Form.Item
                  validateStatus={!data.dirty && Number(data.tokenName) <= 0 ? "error" : ""}
                  help={
                    !data.dirty && Number(data.tokenName) <= 0
                      ? "Should be combination of numbers & alphabets"
                      : ""
                  }
                >
                  <Input
                    placeholder="token name"
                    name="tokenName"
                    onChange={e => handleChange(e)}
                    required
                  />
                </Form.Item>
                <Form.Item>
                  <Input
                    placeholder="white paper/document hash"
                    name="documentHash"
                    onChange={e => handleChange(e)}
                    required
                  />
                </Form.Item>
                <Form.Item>
                  <Input
                    placeholder="token website e.g.: developer.bitcoin.com"
                    name="documentUri"
                    onChange={e => handleChange(e)}
                    required
                  />
                </Form.Item>
                <Form.Item
                  validateStatus={
                    (!data.dirty && data.decimals < 0) || (!data.dirty && data.decimals > 9)
                      ? "error"
                      : ""
                  }
                  help={
                    (!data.dirty && data.decimals < 0) ||
                    (!data.dirty && data.decimals > 9) ||
                    (!data.dirty && data.decimals % 1 !== 0)
                      ? "Must be an integer between 0 and 9"
                      : ""
                  }
                >
                  <Input
                    style={{ padding: "0px 20px" }}
                    placeholder="decimals"
                    name="decimals"
                    onChange={e => handleChange(e)}
                    required
                    type="number"
                    min="0"
                    max="9"
                    step="1"
                  />
                </Form.Item>

                <Form.Item
                  validateStatus={!data.dirty && Number(data.amount) <= 0 ? "error" : ""}
                  help={!data.dirty && Number(data.amount) <= 0 ? "Should be greater than 0" : ""}
                >
                  <Input
                    style={{ padding: "0px 20px" }}
                    placeholder="quantity"
                    name="amount"
                    onChange={e => handleChange(e)}
                    required
                    type="number"
                  />
                </Form.Item>
                <div style={{ paddingTop: "12px" }}>
                  <Button onClick={() => handleCreateToken()}>Create Token</Button>
                </div>
              </Form>
            </Card>
          </Spin>
        </Col>
      </Row>
    </StyledCreate>
  );
};

export default withRouter(Create);
