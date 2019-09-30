import React, { useState } from "react";
import { Row, Col, Icon, Avatar, Card, Empty, Alert } from "antd";
import { EnhancedCard } from "./EnhancedCard";
import { WalletContext } from "./badger/context";
import { Meta } from "antd/lib/list/Item";
import Img from "react-image";
import Jdenticon from "react-jdenticon";
import Mint from "./Mint";
import Transfer from "./Transfer";
import MoreCardOptions from './MoreCardOptions';
import Paragraph from "antd/lib/typography/Paragraph";
import { OnBoarding } from "./OnBoarding";

export default () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, loading } = ContextValue;

  const [selectedToken, setSelectedToken] = useState(null);
  const [action, setAction] = useState(null);
  const SLP_TOKEN_ICONS_URL = "https://tokens.bch.sx/64";

  const onClose = () => {
    setSelectedToken(null);
    setAction(null);
  };

  return (
    <Row type="flex" gutter={8} style={{ position: "relative" }}>
      {loading
        ? Array.from({ length: 4 }).map((v, i) => (
            <Col style={{  marginTop: "8px" }}>
              <EnhancedCard
                loading
                key={i}
                style={{ width: 300 }}
                bordered={false}
              >
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
          <Col style={{  marginTop: "8px" }}>
              <EnhancedCard
                loading={!token.info}
                expand={
                  selectedToken && token.tokenId === selectedToken.tokenId
                }
                onClick={() =>
                  setSelectedToken(
                    !selectedToken || token.tokenId !== selectedToken.tokenId
                      ? token
                      : null
                  )
                }
                key={token.tokenId}
                style={{ width: 300, marginTop: "8px", textAlign: "left" }}
                onClose={onClose}
                actions={[
                  <span onClick={() => setAction(action !== "mint" ? "mint" : null)}>
                    <Icon type="printer" key="printer" /> Mint
                  </span>,
                  <span onClick={() => setAction(action !== "transfer" ? "transfer" : null)}>
                    <Icon type="interaction" key="interaction" /> Transfer
                  </span>,
                  <span
                    onClick={() =>
                      setAction(action !== "other" ? "other" : null)
                    }
                  >
                    <MoreCardOptions hoverContent="teste"><span><Icon style={{ fontSize: "18px" }}type="ellipsis" key="ellipsis"/></span></MoreCardOptions>
                  </span>
                ]}
                renderExpanded={() => (
                    <>
                        {
                          selectedToken && token.tokenId === selectedToken.tokenId ? (
                            <Alert
                              message={
                                <div>
                                    <Paragraph>
                                      <Icon type="info-circle" /> &nbsp; Token properties
                                    </Paragraph>
                                    {
                                      action ? (
                                        <Paragraph small copyable ellipsis style={{ whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                          Token Id: {token.tokenId}
                                        </Paragraph>
                                      ) : Object.entries(token.info || {}).map(entry => (
                                        <Paragraph small copyable={{ text: entry[1] }} ellipsis style={{ whiteSpace: 'nowrap', maxWidth: '100%' }}>
                                          {entry[0]}: {entry[1]}
                                        </Paragraph>
                                      ))
                                    }
                                </div>
                              }
                              type="warning"
                              style={{ marginTop: 4 }}
                            />
                          ) : null
                        }
                        {
                            selectedToken && action === 'mint' ? <Mint token={selectedToken} onClose={onClose}/> : null
                        }
                        {
                            selectedToken && action === 'transfer' ? <Transfer token={selectedToken} onClose={onClose}/> : null
                        }
                    </>
                )}
              >
                <Meta
                  avatar={
                    <Img
                      src={`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`}
                      unloader={<Jdenticon size="64" value={token.tokenId} />}
                    />
                  }
                  title={
                    <>
                      <span>x{token.balance} </span>
                      <span>{token.info && token.info.symbol}</span>
                    </>
                  }
                  description={(
                    <div>
                      <div>{token.info && token.info.name}</div>
                    </div>
                  )}
                />
              </EnhancedCard>
            </Col>
          ))
        : null}
      <Col span={24} style={{  marginTop: "8px" }}>
        {!loading && !tokens.length && wallet ? <Empty description="No tokens found" /> : null}
        {!loading && !tokens.length && !wallet ? <OnBoarding /> : null}
      </Col>
    </Row>
  );
};
