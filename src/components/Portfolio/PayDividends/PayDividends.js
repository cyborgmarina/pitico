/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { WalletContext } from "../../../utils/context";
import {
  sendDividends,
  getBalancesForToken,
  getElegibleAddresses,
  DUST
} from "../../../utils/sendDividends";
import { Card, Icon, Form, Button, Alert, Spin, notification, Badge, Tooltip, message } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import isPiticoTokenHolder from "../../../utils/isPiticoTokenHolder";
import debounce from "../../../utils/debounce";
import { getBalanceFromUtxos, getBCHUtxos } from "../../../utils/sendBch";
import { FormItemWithMaxAddon } from "../EnhancedInputs";
import { retry } from "../../../utils/retry";

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
    const { value } = formData;
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
          <a href={link} target="_blank" rel="noopener noreferrer">
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

    if (name === "value") {
      calcElegibles(value);
    }
  };

  const onMaxDividend = async () => {
    setLoading(true);

    try {
      const utxos = await retry(() => getBCHUtxos(wallet.cashAddress));
      const totalBalance = getBalanceFromUtxos(utxos);
      const { txFee } = await getElegibleAddresses(wallet, stats.balances, totalBalance);
      let value = totalBalance - txFee >= 0 ? (totalBalance - txFee).toFixed(8) : 0;
      setFormData({
        ...formData,
        value
      });
      await calcElegibles(value);
    } catch (err) {
      message.error("Unable to calculate the max value due to network errors");
    }

    setLoading(false);
  };

  return (
    <StyledPayDividends>
      <Row type="flex" className="dividends">
        <Col span={24}>
          <Spin spinning={loading}>
            <Card
              title={
                <h2>
                  <Icon type="dollar-circle" theme="filled" /> Pay Dividends
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
                        <a href="https://t.me/piticocash" target="_blank" rel="noopener noreferrer">
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
                        <FormItemWithMaxAddon
                          style={{ margin: 0 }}
                          validateStatus={
                            !formData.dirty && Number(formData.value) <= 0 ? "error" : ""
                          }
                          help={
                            !formData.dirty && Number(formData.value) < DUST
                              ? "Must be greater than 0"
                              : ""
                          }
                          onMax={onMaxDividend}
                          inputProps={{
                            suffix: "BCH",
                            name: "value",
                            placeholder: "value",
                            onChange: e => handleChange(e),
                            required: true,
                            value: formData.value
                          }}
                        />
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
