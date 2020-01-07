import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { WalletContext } from "../../../utils/context";
import {
  sendDividends,
  getBalancesForToken,
  getElegibleAddresses,
  DUST
} from "../../../utils/sendDividends";
import { Card, Icon, Form, Input, Button, Alert, Spin, notification, Badge, Tooltip } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import isPiticoTokenHolder from "../../../utils/isPiticoTokenHolder";
import debounce from "../../../utils/debounce";
import { getBCHBalanceFromUTXO } from "../../../utils/sendBch";
import bchLogo from "../../../assets/bch-logo.png";

const StyledPayDividends = styled.div`
  * {
    color: rgb(62, 63, 66) !important;
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

const PayDividends = ({ SLP, token, onClose }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, balances } = ContextValue;
  const [formData, setFormData] = useState({
    dirty: true,
    value: "",
    tokenId: token.tokenId
  });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ tokens: 0, holders: 0, eligibles: 0, txFee: 0 });

  const totalBalance = balances.totalBalance;

  const submitEnabled =
    formData.tokenId &&
    formData.value &&
    Number(formData.value) > DUST &&
    (totalBalance - Number(formData.value) - Number(stats.txFee)).toFixed(8) >= 0;
  useEffect(() => {
    setLoading(true);
    getBalancesForToken(token.tokenId)
      .then(balancesForToken => {
        setStats({
          ...stats,
          tokens: balancesForToken.totalBalance,
          holders: balancesForToken.length ? balancesForToken.length - 1 : 0,
          balances: balancesForToken,
          txFee: 0
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const calcElegibles = useCallback(
    debounce(value => {
      if (stats.balances && value && !Number.isNaN(value)) {
        setLoading(true);
        getElegibleAddresses(wallet, stats.balances, value)
          .then(({ addresses, txFee }) => {
            setStats({ ...stats, eligibles: addresses.length, txFee });
          })
          .finally(() => setLoading(false));
      } else {
        setStats({ ...stats, eligibles: 0, txFee: 0 });
      }
    }),
    [wallet, stats]
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
    try {
      const link = await sendDividends(wallet, {
        value,
        tokenId: token.tokenId
      });

      if (!link) {
        setLoading(false);

        return notification.info({
          message: "Info",
          description: (
            <Paragraph>No token holder with sufficient balance to receive dividends.</Paragraph>
          ),
          duration: 2
        });
      }

      notification.success({
        message: "Success",
        description: (
          <a href={link} target="_blank">
            <Paragraph>Transaction successful. Click or tap here for more details</Paragraph>
          </a>
        ),
        duration: 2
      });

      setLoading(false);
      onClose();
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

    if (name === "value") {
      calcElegibles(value);
    }
  };

  const onMaxDividend = async () => {
    setLoading(true);

    try {
      const bal = await getBCHBalanceFromUTXO(wallet);
      const { txFee } = await getElegibleAddresses(wallet, stats.balances, bal);
      let value = bal - txFee - DUST >= 0 ? (bal - txFee - DUST).toFixed(8) : 0;
      setFormData({
        ...formData,
        value: value
      });
      await calcElegibles(value);
      setLoading(false);
    } catch (err) {}
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
              {!isPiticoTokenHolder(tokens) ? (
                <Alert
                  message={
                    <span>
                      <Paragraph>
                        <Icon type="warning" /> EXPERIMENTAL
                      </Paragraph>
                      <Paragraph>
                        This is an experimental feature, available only to Pitico Cash token
                        holders.
                      </Paragraph>
                      <Paragraph>
                        <a href="https://t.me/piticocash" target="_blank">
                          Join our Telegram Group to get your $PTCH.
                        </a>
                      </Paragraph>
                    </span>
                  }
                  type="warning"
                  closable={false}
                />
              ) : null}
              <br />
              {isPiticoTokenHolder(tokens) ? (
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
                            prefix={<img src={bchLogo} alt="" width={16} height={16} />}
                            step="0.00000001"
                            suffix="BCH"
                            name="value"
                            placeholder="value"
                            onChange={e => handleChange(e)}
                            required
                            value={formData.value}
                            addonAfter={<Button onClick={onMaxDividend}>max</Button>}
                          />
                        </Form.Item>
                      </Form>
                    </Col>
                    <Col>
                      <Tooltip title="Bitcoincash balance">
                        <StyledStat>
                          <Icon type="dollar" />
                          &nbsp;
                          <Badge
                            count={totalBalance.toFixed(8) || "0"}
                            overflowCount={Number.MAX_VALUE}
                            showZero
                          />
                          <Paragraph>Balance</Paragraph>
                        </StyledStat>
                      </Tooltip>
                    </Col>
                    &nbsp; &nbsp; &nbsp;
                    <Col>
                      <Tooltip title="Transaction fee">
                        <StyledStat>
                          <Icon type="minus-circle" />
                          &nbsp;
                          <Badge
                            count={stats.txFee || "0"}
                            overflowCount={Number.MAX_VALUE}
                            showZero
                          />
                          <Paragraph>Fee</Paragraph>
                        </StyledStat>
                      </Tooltip>
                    </Col>
                    <br />
                    <br />
                    <Col span={24}>
                      <Button disabled={!submitEnabled} onClick={() => submit()}>
                        Pay Dividends
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : null}
            </Card>
          </Spin>
        </Col>
      </Row>
    </StyledPayDividends>
  );
};

export default PayDividends;
