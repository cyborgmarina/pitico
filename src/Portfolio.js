import React, { useState } from "react";
import { Row, Col, Icon, Avatar, Card, Empty } from "antd";
import { EnhancedCard } from "./EnhancedCard";
import { WalletContext } from "./badger/context";
import { Meta } from "antd/lib/list/Item";
import Img from "react-image";
import Jdenticon from "react-jdenticon";
import Mint from "./Mint";
import MoreCardOptions from './MoreCardOptions';

export default () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, loading } = ContextValue;

  const [selectedToken, setSelectedToken] = useState(null);
  const [action, setAction] = useState(null);
  const SLP_TOKEN_ICONS_URL = "https://tokens.bch.sx/64";

  return (
    <Row type="flex" gutter={8} style={{ position: "relative" }}>
      {loading
        ? Array.from({ length: 4 }).map((v, i) => (
            <Col>
              <EnhancedCard
                loading
                key={i}
                style={{ width: 300, marginTop: "8px" }}
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
            <Col>
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
                onClose={() => {
                  setSelectedToken(null);
                  setAction(null);
                }}
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
                            selectedToken && action === 'mint' ? <Mint /> : null
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
                  description={token.info && token.info.name}
                />
              </EnhancedCard>
            </Col>
          ))
        : null}
      {!loading && !tokens.length ? <Empty description="No tokens found" /> : null}
    </Row>
  );
};
