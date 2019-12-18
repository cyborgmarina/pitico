import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ButtonQR } from "badger-components-react";
import { WalletContext } from "../utils/context";
import {
  sendDividends,
  getBalancesForToken,
  getElegibleAddresses,
  DUST
} from "../utils/sendDividends";
import {
  Card,
  Icon,
  Avatar,
  Table,
  Form,
  Input,
  Button,
  Alert,
  Select,
  Spin,
  notification,
  Badge,
  Tooltip
} from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import isPiticoTokenHolder from "../utils/isPiticoTokenHolder";
import debounce from "../utils/debounce";
import withSLP from "../utils/withSLP";
import Text from "antd/lib/typography/Text";
import { getBCHBalanceFromUTXO } from "../utils/sendBch";
import { payInvoice } from "bitcoin-wallet-api";

const InputGroup = Input.Group;
const { Meta } = Card;
const { Option } = Select;

const StyledPayDividends = styled.div`
  * {
    color: rgb(62, 63, 66) !important;
  }
`;

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

const StyledStat = styled.div`
  font-size: 12px;

  .ant-badge sup {
    background: #fbfcfd;
    color: rgba(255, 255, 255, 0.65);
    box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.35);
  }
`;

const PayDividends = () => {
  const [formData, setFormData] = useState({
    dirty: true,
    value: "",
    tokenId: ""
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ tokens: 0, holders: 0, eligibles: 0, txFee: 0 });

  const submitEnabled = formData.tokenId && formData.value && Number(formData.value) > DUST;
  useEffect(() => {
    // setLoading(true);
    // getBalancesForToken(token.tokenId)
    //   .then(balancesForToken => {
    //     setStats({
    //       ...stats,
    //       tokens: balancesForToken.totalBalance,
    //       holders: balancesForToken.length ? balancesForToken.length - 1 : 0,
    //       balances: balancesForToken,
    //       txFee: 0
    //     });
    //   })
    //   .finally(() => setLoading(false));
  }, []);

  const calcElegibles = useCallback(
    debounce(value => {
      if (stats.balances && value && !Number.isNaN(value)) {
        setLoading(true);
        getElegibleAddresses(stats.balances, value).then(({ addresses }) => {
          setStats({ ...stats, eligibles: addresses.length });
          setLoading(false);
        });
      } else {
        setStats({ ...stats, eligibles: 0 });
      }
    }),
    [stats]
  );

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (!submitEnabled) {
      return;
    }

    setLoading(true);
    const { value, tokenId } = formData;
    const { eligibles } = stats;
    try {
      const url = await sendDividends({
        value,
        tokenId,
        memo: `Bitcoincom Mint ${value}BCH in dividends to ${eligibles} addresses holding the tokenId ${tokenId}`
      });

      if (!url) {
        throw "Unknown error";
      }

      const paymentMemo = await payInvoice({ url }).then(({ memo }) => memo);
      notification.success({
        message: "Success",
        description: (
          <a href={url} target="_blank">
            <Paragraph>{paymentMemo}</Paragraph>
          </a>
        ),
        duration: 0
      });

      setLoading(false);
    } catch (e) {
      let message;

      if (/don't have the minting baton/.test(e.message)) {
        message = e.message;
      } else if (/Invalid BCH address/.test(e.message)) {
        message = "Invalid BCH address";
      } else if (/64: dust/.test(e.message)) {
        message = "Small amount";
      } else if (/Balance 0/.test(e.message)) {
        message = "Balance of sending address is zero";
      } else if (/Insufficient funds/.test(e.message)) {
        message = "Insufficient funds.";
      } else {
        message = e.error || e.message;
      }

      notification.error({
        message: "Error",
        description: message
      });
      console.error(e.message);
      setLoading(false);
    }
  }

  const handleChange = e => {
    const { value, name } = e.target;
    setFormData(p => ({ ...p, [name]: value }));

    if (name === "value") {
      calcElegibles(value);
    }
  };

  const handleTokenIdChange = e => {
    const { value, name } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
    setLoading(true);
    getBalancesForToken(value)
      .then(balancesForToken => {
        setLoading(false);
        setStats({
          ...stats,
          tokens: balancesForToken.totalBalance,
          holders: balancesForToken.length ? balancesForToken.length - 1 : 0,
          balances: balancesForToken,
          txFee: 0
        });
      })
      .catch(err => {})
      .finally(() => setLoading(false));
  };

  return (
    <StyledPayDividends>
      <Row type="flex" className="dividends">
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
              <br />
              <>
                <Row type="flex">
                  <Col>
                    <Tooltip title="Circulating Supply">
                      <StyledStat>
                        <Icon type="gold" />
                        &nbsp;
                        <Badge
                          count={new Intl.NumberFormat("en-US").format(stats.tokens)}
                          overflowCount={Number.MAX_VALUE}
                          showZero
                        />
                        <Paragraph>Tokens</Paragraph>
                      </StyledStat>
                    </Tooltip>
                  </Col>
                  &nbsp; &nbsp; &nbsp;
                  <Col>
                    <Tooltip title="Addresses with at least one token">
                      <StyledStat>
                        <Icon type="team" />
                        &nbsp;
                        <Badge
                          count={new Intl.NumberFormat("en-US").format(stats.holders)}
                          overflowCount={Number.MAX_VALUE}
                          showZero
                        />
                        <Paragraph>Holders</Paragraph>
                      </StyledStat>
                    </Tooltip>
                  </Col>
                  &nbsp; &nbsp; &nbsp;
                  <Col>
                    <Tooltip title="Addresses elegible to receive dividends for the specified value">
                      <StyledStat>
                        <Icon type="usergroup-add" />
                        &nbsp;
                        <Badge
                          count={new Intl.NumberFormat("en-US").format(stats.eligibles)}
                          overflowCount={Number.MAX_VALUE}
                          showZero
                        />
                        <Paragraph>Eligibles</Paragraph>
                      </StyledStat>
                    </Tooltip>
                  </Col>
                </Row>
                <Row type="flex">
                  <Col span={24}>
                    <Form style={{ width: "auto", marginBottom: "1em" }} noValidate>
                      <Form.Item style={{ margin: 0 }}>
                        <Input
                          placeholder="token id (txid of token genesis transaction)"
                          name="tokenId"
                          onChange={e => handleTokenIdChange(e)}
                          required
                          value={formData.tokenId}
                        />
                      </Form.Item>
                      <br />
                      <Form.Item
                        style={{ margin: 0 }}
                        validateStatus={
                          !formData.dirty && Number(formData.value) <= 0 ? "error" : ""
                        }
                        help={
                          !formData.dirty && Number(formData.value) < DUST
                            ? "BCH dividend must be greater than 0.00005 BCH"
                            : ""
                        }
                      >
                        <Input
                          prefix={<Icon type="dollar" />}
                          step="0.00000001"
                          suffix="BCH"
                          placeholder="e.g: 0.01"
                          name="value"
                          onChange={e => handleChange(e)}
                          required
                          value={formData.value}
                        />
                      </Form.Item>
                    </Form>
                  </Col>
                  <br />
                  <Col span={24}>
                    <Button disabled={!submitEnabled} onClick={() => submit()}>
                      Pay Dividends
                    </Button>
                  </Col>
                </Row>
              </>
            </Card>
          </Spin>
        </Col>
      </Row>
    </StyledPayDividends>
  );
};

export default PayDividends;
