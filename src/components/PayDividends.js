import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { ButtonQR } from "badger-components-react";
import { WalletContext } from "../utils/context";
import { sendDividends, getBalancesForToken, getElegibleAddresses } from "../utils/sendDividends";
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

const InputGroup = Input.Group;
const { Meta } = Card;
const { Option } = Select;

const DUST = 0.00005;

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
    background-color: #3b3b4d;
    color: rgba(255, 255, 255, 0.65);
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
  const [stats, setStats] = useState({ tokens: 0, holders: 0, eligibles: 0 });

  useEffect(() => {
    setLoading(true);
    getBalancesForToken(token.tokenId)
      .then(balancesForToken => {
        setStats({
          ...stats,
          tokens: balancesForToken.totalBalance,
          holders: balancesForToken.length ? balancesForToken.length - 1 : 0,
          balances: balancesForToken
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const calcElegibles = useCallback(
    debounce(value => {
      if (stats.balances && value && !Number.isNaN(value)) {
        getElegibleAddresses(wallet, stats.balances, value).then(({ addresses }) => {
          setStats({ ...stats, eligibles: addresses.length });
        });
      } else {
        setStats({ ...stats, eligibles: 0 });
      }
    }),
    [wallet, stats]
  );

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (!formData.tokenId || !formData.value || Number(formData.value) < DUST) {
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
          duration: 0
        });
      }

      notification.success({
        message: "Success",
        description: (
          <a href={link} target="_blank">
            <Paragraph>Transaction successful. Click or tap here for more details</Paragraph>
          </a>
        ),
        duration: 0
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
        message = "Service unavailable, try again later";
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

  return (
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
            <Alert
              message={
                <>
                  <Paragraph>
                    <Icon type="warning" /> BE CAREFUL.
                  </Paragraph>
                  <Paragraph>This is an experimental feature, strange things may happen.</Paragraph>
                </>
              }
              type="warning"
              closable={false}
            />
            <br />
            <Row type="flex">
              <Col>
                <Tooltip title="Circulating Supply">
                  <StyledStat>
                    <Icon type="gold" />
                    &nbsp;
                    <Badge count={stats.tokens} overflowCount={100000000} showZero />
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
                    <Badge count={stats.holders} overflowCount={100000000} showZero />
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
                    <Badge count={stats.eligibles} overflowCount={100000000} showZero />
                    <Paragraph>Eligibles</Paragraph>
                  </StyledStat>
                </Tooltip>
              </Col>
            </Row>
            <Row type="flex">
              <Col span={24}>
                <Form style={{ width: "auto" }}>
                  <Form.Item
                    validateStatus={!formData.dirty && Number(formData.value) <= 0 ? "error" : ""}
                    help={
                      !formData.dirty && Number(formData.value) < DUST
                        ? "BCH dividend must be greater than 0.00005 BCH"
                        : ""
                    }
                  >
                    <Input
                      prefix={<Icon type="block" />}
                      suffix="BCH"
                      placeholder="e.g: 0.01"
                      name="value"
                      onChange={e => handleChange(e)}
                      required
                      type="number"
                    />
                  </Form.Item>
                </Form>
              </Col>
              <br />
              <br />
              <Col span={24}>
                <Button onClick={() => submit()}>Pay Dividends</Button>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default PayDividends;
