import React, { useState } from "react";
import { Row, Col, Icon, Avatar, Empty, Alert, notification, Radio, Spin } from "antd";
import { EnhancedCard } from "./EnhancedCard";
import { WalletContext } from "../../utils/context";
import { Meta } from "antd/lib/list/Item";
import Img from "react-image";
import Identicon from "./Identicon";
import Mint from "./Mint/Mint";
import Transfer from "./Transfer/Transfer";
import PayDividends from "./PayDividends/PayDividends";
import SendBCH from "./SendBCH/SendBCH";
import { PlaneIcon, HammerIcon } from "../Common/CustomIcons";
import MoreCardOptions from "./MoreCardOptions";
import PayDividendsOption from "./PayDividendsOption";
import Paragraph from "antd/lib/typography/Paragraph";
import { OnBoarding } from "../OnBoarding/OnBoarding";
import getTokenTransactionHistory from "../../utils/getTokenTransactionHistory";
import bchFlagLogo from "../../assets/4-bitcoin-cash-logo-flag.png";

export default () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, loading, balances } = ContextValue;
  const [selectedToken, setSelectedToken] = useState(null);
  const [action, setAction] = useState(null);
  const SLP_TOKEN_ICONS_URL = "https://tokens.bch.sx/64";

  const [loadingTokenHistory, setLoadingTokenHistory] = useState(false);
  const [tokenCardAction, setTokenCardAction] = useState("details");
  const [history, setHistory] = useState(null);
  const [outerAction, setOuterAction] = useState(false);
  const getTokenHistory = async tokenId => {
    setLoadingTokenHistory(true);
    try {
      const resp = await getTokenTransactionHistory(wallet.slpAddresses.slice(0, 1), tokenId);

      setHistory(resp);
    } catch (err) {
      const message = err.message;

      notification.error({
        message: "Error",
        description: message,
        duration: 2
      });
      console.error(err.message);
    }

    setLoadingTokenHistory(false);
  };

  const handleChangeAction = (e, tokenId) => {
    setAction(null);
    if (tokenCardAction === "details") {
      setTokenCardAction("history");
      getTokenHistory(tokenId);
    } else if (tokenCardAction === "history") {
      setTokenCardAction("details");
    } else if (tokenCardAction === null) {
      if (e.target.value === "details") {
        setTokenCardAction("details");
      } else if (e.target.value === "history") {
        setTokenCardAction("history");
        getTokenHistory(tokenId);
      }
    }
  };
  const onClose = () => {
    setSelectedToken(null);
    setAction(null);
    setLoadingTokenHistory(false);
    setTokenCardAction("details");
    setHistory(null);
  };

  const renderActions = (action, setAction, token) => {
    const hasBaton = token.info && token.info.hasBaton;
    let actions = [
      <span
        onClick={() => {
          setAction("transfer");
          setTokenCardAction(tokenCardAction !== null ? null : tokenCardAction);
        }}
      >
        <PlaneIcon />
        Send
      </span>,
      <span
        onClick={() => {
          setAction("dividends");
          setTokenCardAction(tokenCardAction !== null ? null : tokenCardAction);
        }}
      >
        <Icon style={{ fontSize: "18px" }} type="dollar-circle" theme="filled" />
        {hasBaton ? "Dividends" : "Pay Dividends"}
      </span>
    ];
    if (hasBaton) {
      actions.push(actions[1]);
      actions[1] = (
        <span
          onClick={() => {
            setAction("mint");
            setTokenCardAction(tokenCardAction !== null ? null : tokenCardAction);
          }}
        >
          <HammerIcon /> Mint
        </span>
      );
    }

    return actions;
  };

  return (
    <Row type="flex" gutter={32} style={{ position: "relative" }}>
      {!loading && wallet && (
        <Col style={{ marginTop: "8px" }} xl={8} lg={12} span={24}>
          <EnhancedCard
            style={{ marginTop: "8px", textAlign: "left" }}
            expand={!selectedToken && action === "sendBCH"}
            actions={[
              <span
                onClick={() => {
                  setAction("sendBCH");
                  setOuterAction(!outerAction);
                }}
              >
                <PlaneIcon />
                Send
              </span>
            ]}
            onClick={evt => {
              setAction("sendBCH");
              setSelectedToken(null);
              setOuterAction(!outerAction);
            }}
            renderExpanded={() =>
              action === "sendBCH" && <SendBCH onClose={onClose} outerAction={outerAction} />
            }
            onClose={onClose}
          >
            <Meta
              avatar={<Img src={bchFlagLogo} width="96" height="54" />}
              title={
                <div
                  style={{
                    float: "right"
                  }}
                >
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: "rgb(62, 63, 66)" }}>
                    BCH
                  </div>
                  <div
                    style={{
                      color: "rgb(158, 160, 165)",
                      fontSize: "12px",
                      fontWeight: "500",
                      whiteSpace: "nowrap"
                    }}
                  >
                    Bitcoin Cash
                  </div>
                </div>
              }
              description={
                <div>
                  <div
                    style={{
                      color: "rgb(62, 63, 66)",
                      fontSize: "16px",
                      fontWeight: "bold"
                    }}
                  >
                    {balances.totalBalance ? balances.totalBalance.toFixed(8) : "0"}
                  </div>
                </div>
              }
            />
          </EnhancedCard>
        </Col>
      )}
      {loading
        ? Array.from({ length: 20 }).map((v, i) => (
            <Col key={i} style={{ marginTop: "8px" }} xl={8} lg={12} span={24}>
              <EnhancedCard loading bordered={false}>
                <Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title="Token symbol"
                  description="Token description"
                />
              </EnhancedCard>
            </Col>
          ))
        : null}
      {tokens.length
        ? tokens.map(token => (
            <Col
              style={{ marginTop: "8px" }}
              xl={8}
              lg={12}
              sm={12}
              span={24}
              key={`col-${token.tokenId}`}
            >
              <EnhancedCard
                token={token}
                loading={!token.info}
                expand={selectedToken && token.tokenId === selectedToken.tokenId}
                onClick={() =>
                  setSelectedToken(
                    !selectedToken || token.tokenId !== selectedToken.tokenId ? token : null
                  )
                }
                key={`card-${token.tokenId}`}
                style={{ marginTop: "8px", textAlign: "left" }}
                onClose={onClose}
                actions={renderActions(action, setAction, token)}
                renderExpanded={() => (
                  <Spin spinning={loadingTokenHistory}>
                    <Radio.Group
                      defaultValue="details"
                      onChange={e => handleChangeAction(e, selectedToken.tokenId)}
                      value={tokenCardAction}
                      style={{
                        width: "100%",
                        textAlign: "center",
                        marginTop: "0px",
                        marginBottom: "18px"
                      }}
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button
                        style={{
                          borderRadius: "19.5px",
                          height: "40px",
                          width: "50%",
                          fontSize: "16px"
                        }}
                        value="details"
                        onClick={e => handleChangeAction(e, selectedToken.tokenId)}
                      >
                        <Icon style={{ color: "#fff" }} type="info-circle" /> Details
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          borderRadius: "19.5px",
                          height: "40px",
                          width: "50%",
                          fontSize: "16px"
                        }}
                        value="history"
                        onClick={e => handleChangeAction(e, selectedToken.tokenId)}
                      >
                        <Icon style={{ color: "#fff" }} type="history" /> History
                      </Radio.Button>
                    </Radio.Group>
                    {!loadingTokenHistory &&
                    selectedToken &&
                    token.tokenId === selectedToken.tokenId &&
                    tokenCardAction === "details" ? (
                      <Alert
                        message={
                          <div>
                            <Paragraph>
                              <Icon type="info-circle" /> &nbsp; Token properties
                            </Paragraph>
                            {Object.entries(token.info || {}).map(entry => (
                              <Paragraph
                                key={`paragraph-${token.tokenId}-${entry[0]}`}
                                small
                                copyable={{ text: entry[1] }}
                                ellipsis
                                style={{ whiteSpace: "nowrap", maxWidth: "100%" }}
                              >
                                {entry[0]}: {entry[1]}
                              </Paragraph>
                            ))}
                          </div>
                        }
                        type="warning"
                        style={{ marginTop: 4 }}
                      />
                    ) : null}

                    {!loadingTokenHistory &&
                    selectedToken &&
                    token.tokenId === selectedToken.tokenId &&
                    tokenCardAction === "history" ? (
                      <>
                        <p>Transaction History (max 30)</p>
                        {history.map(el => (
                          <div
                            key={`history-${el.txid}`}
                            style={{
                              background: el.balance > 0 ? "#D4EFFC" : " #ffd59a",
                              color: "black",
                              borderRadius: "12px",
                              marginBottom: "18px",
                              padding: "8px",
                              boxShadow: "6px 6px #888888",
                              width: "97%"
                            }}
                          >
                            <a
                              href={`https://explorer.bitcoin.com/bch/tx/${el.txid}`}
                              target="_blank"
                            >
                              <p>
                                {el.balance > 0
                                  ? el.detail.transactionType === "GENESIS"
                                    ? "Genesis"
                                    : "Received"
                                  : "Sent"}
                              </p>
                              <p>{el.date.toLocaleString()}</p>

                              <p>{`${el.balance > 0 ? "+" : ""}${el.balance} ${
                                el.detail.symbol
                              }`}</p>

                              <Paragraph
                                small
                                ellipsis
                                style={{ whiteSpace: "nowrap", color: "black", maxWidth: "90%" }}
                              >
                                {el.txid}
                              </Paragraph>
                              <p>{`Confirmed: ${el.confirmed ? "Yes" : "No"}`}</p>
                            </a>
                          </div>
                        ))}
                        <a
                          href={`https://explorer.bitcoin.com/bch/address/${wallet.slpAddress}`}
                          target="_blank"
                        >
                          <p>Full History</p>
                        </a>
                      </>
                    ) : null}

                    {selectedToken && action === "mint" && tokenCardAction === null ? (
                      <Mint token={selectedToken} onClose={onClose} />
                    ) : null}
                    {selectedToken && action === "transfer" && tokenCardAction === null ? (
                      <Transfer token={selectedToken} onClose={onClose} />
                    ) : null}
                    {selectedToken && action === "dividends" && tokenCardAction === null ? (
                      <PayDividends token={selectedToken} onClose={onClose} />
                    ) : null}
                  </Spin>
                )}
              >
                <Meta
                  avatar={
                    <Img
                      src={`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`}
                      unloader={
                        <Identicon
                          key={`identicon-${token.tokenId}`}
                          style={{ tranform: "translate(-100px,100px)" }}
                          seed={token.tokenId}
                        />
                      }
                    />
                  }
                  title={
                    <div
                      style={{
                        float: "right"
                      }}
                    >
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "rgb(62, 63, 66)"
                        }}
                      >
                        {token.info && token.info.symbol.toUpperCase()}
                      </div>
                      <div
                        style={{
                          color: "rgb(158, 160, 165)",
                          fontSize: "12px",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "210px"
                        }}
                      >
                        {token.info && token.info.name}
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      <div
                        style={{
                          color: "rgb(62, 63, 66)",
                          fontSize: "16px",
                          fontWeight: "bold"
                        }}
                      >
                        {token.balance.toString()}
                      </div>
                    </div>
                  }
                />
              </EnhancedCard>
            </Col>
          ))
        : null}
      <Col span={24} style={{ marginTop: "8px" }}>
        {!loading && !tokens.length && wallet ? <Empty description="No tokens found" /> : null}
        {!loading && !tokens.length && !wallet ? <OnBoarding /> : null}
      </Col>
    </Row>
  );
};
