import React, { useEffect } from "react";
import "../index.css";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { ButtonQR } from "badger-components-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { WalletContext } from "../utils/context";
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
  Typography,
  Radio
} from "antd";
import createToken from "../utils/broadcastTransaction";
import { sendAssets } from "bitcoin-wallet-api";

const { Paragraph, Text } = Typography;
const SLP = "SLP";
const BCH = "BCH";

const Create = ({ history }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, balances, loading: loadingContext } = ContextValue;
  const [loading, setLoading] = React.useState(false);
  const radio = React.useRef(null);
  const [data, setData] = React.useState({
    dirty: true,
    receiveAddress: "",
    protocol: BCH,
    tokenId: "",
    amount: null
  });
  const [asset, setAsset] = React.useState(BCH);
  const [txid, setTxid] = React.useState();

  function handleSend() {
    setData({
      ...data,
      dirty: false
    });

    const { receiveAddress, tokenId, amount } = data;
    if (!receiveAddress || (asset === SLP && !tokenId) || !amount || Number(amount) <= 0) {
      return;
    }
    setLoading(true);
    sendAssets({
      to: receiveAddress,
      protocol: asset,
      assetId: tokenId,
      value: amount
    })
      .then(({ txid }) => {
        setTxid(txid);
        notification.success({
          message: "Success",
          description: (
            <a href={`https://explorer.bitcoin.com/bch/tx/${txid}`} target="_blank">
              <Paragraph>Transaction successful. Click or tap here for more details</Paragraph>
            </a>
          ),
          duration: 0
        });
        setLoading(false);
      })
      .catch(({ description }) => {
        notification.error({
          message: "Error",
          description
        });
        setLoading(false);
      });
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setData(p => ({ ...p, [name]: value }));
  };

  const handleAsset = e => {
    setAsset(asset === BCH ? SLP : BCH);
  };

  return (
    <Row justify="center" type="flex">
      <Col lg={8} span={24}>
        <Spin spinning={loading || loadingContext}>
          <Card
            style={{ boxShadow: "0px 0px 40px 0px rgba(0,0,0,0.35)", borderRadius: "8px" }}
            title={
              <h2>
                <Icon type="interaction" theme="filled" /> Send
              </h2>
            }
            bordered={true}
          >
            <Form>
              <Form.Item
                validateStatus={!data.dirty && !data.receiveAddress ? "error" : ""}
                help={
                  !data.dirty && !data.receiveAddress
                    ? "Should be combination of numbers & alphabets"
                    : ""
                }
              >
                <Input
                  placeholder={`Receive Address (${asset === BCH ? "cash" : "slp"} address format)`}
                  name="receiveAddress"
                  onChange={e => handleChange(e)}
                  required
                />
              </Form.Item>
              <Form.Item
                validateStatus={!data.dirty && !data.receiveAddress ? "error" : ""}
                help={
                  !data.dirty && !data.receiveAddress
                    ? "Should be combination of numbers & alphabets"
                    : ""
                }
              >
                <Radio.Group
                  defaultValue={BCH}
                  value={asset}
                  size="small"
                  buttonStyle="solid"
                  ref={radio}
                >
                  <Radio.Button
                    style={{
                      borderRadius: "19.5px",
                      height: "40px",
                      width: "103px"
                    }}
                    value={BCH}
                    onClick={e => handleAsset(e)}
                  >
                    BCH
                  </Radio.Button>
                  <Radio.Button
                    style={{
                      borderRadius: "19.5px",
                      height: "40px",
                      width: "103px"
                    }}
                    value={SLP}
                    onClick={e => handleAsset(e)}
                  >
                    SLP
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
              {asset === SLP && (
                <Form.Item>
                  <Input
                    placeholder="SLP Token ID"
                    name="tokenId"
                    onChange={e => handleChange(e)}
                    required
                  />
                </Form.Item>
              )}
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
                <Button onClick={() => handleSend()}>Send</Button>
              </div>
            </Form>
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default withRouter(Create);
