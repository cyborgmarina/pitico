import React, { useState } from "react";
import { Row, Col, Icon, Avatar, Empty, Alert } from "antd";
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
import bchFlagLogo from "../../assets/4-bitcoin-cash-logo-flag.png";

export default () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, loading, balances } = ContextValue;

  const [selectedToken, setSelectedToken] = useState(null);
  const [action, setAction] = useState(null);
  const SLP_TOKEN_ICONS_URL = "https://tokens.bch.sx/64";

  const onClose = () => {
    setSelectedToken(null);
    setAction(null);
  };

  const renderActions = (action, setAction, token) => {
    const hasBaton = token.info && token.info.hasBaton;
    let actions = [
      <span onClick={() => setAction(action !== "transfer" ? "transfer" : null)}>
        <PlaneIcon />
        Send
      </span>,
      <span onClick={() => setAction(action !== "dividends" ? "dividends" : null)}>
        <Icon style={{ fontSize: "18px" }} type="dollar-circle" theme="filled" />
        {hasBaton ? "Dividends" : "Pay Dividends"}
      </span>
    ];
    if (hasBaton) {
      actions.push(actions[1]);
      actions[1] = (
        <span onClick={() => setAction(action !== "mint" ? "mint" : null)}>
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
              <span onClick={() => setAction(action !== "sendBCH" ? "sendBCH" : null)}>
                <PlaneIcon />
                Send
              </span>
            ]}
            onClick={evt => {
              setAction(action !== "sendBCH" ? "sendBCH" : null);
              setSelectedToken(null);
            }}
            renderExpanded={() => action === "sendBCH" && <SendBCH onClose={onClose} />}
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
                  <>
                    {selectedToken && action === null && token.tokenId === selectedToken.tokenId ? (
                      <Alert
                        message={
                          <div>
                            <Paragraph>
                              <Icon type="info-circle" /> &nbsp; Token properties
                            </Paragraph>
                            {action ? (
                              <Paragraph
                                small
                                copyable
                                ellipsis
                                style={{ whiteSpace: "nowrap", maxWidth: "100%" }}
                              >
                                Token Id: {token.tokenId}
                              </Paragraph>
                            ) : (
                              Object.entries(token.info || {}).map(entry => (
                                <Paragraph
                                  key={`paragraph-${token.tokenId}-${entry[0]}`}
                                  small
                                  copyable={{ text: entry[1] }}
                                  ellipsis
                                  style={{ whiteSpace: "nowrap", maxWidth: "100%" }}
                                >
                                  {entry[0]}: {entry[1]}
                                </Paragraph>
                              ))
                            )}
                          </div>
                        }
                        type="warning"
                        style={{ marginTop: 4 }}
                      />
                    ) : null}

                    {selectedToken && action === "mint" ? (
                      <Mint token={selectedToken} onClose={onClose} />
                    ) : null}
                    {selectedToken && action === "transfer" ? (
                      <Transfer token={selectedToken} onClose={onClose} />
                    ) : null}
                    {selectedToken && action === "dividends" ? (
                      <PayDividends token={selectedToken} onClose={onClose} />
                    ) : null}
                  </>
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
