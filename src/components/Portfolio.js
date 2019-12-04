import React, { useState } from "react";
import { Row, Col, Icon, Avatar, Card, Empty, Alert } from "antd";
import { EnhancedCard } from "./EnhancedCard";
import { WalletContext } from "../utils/context";
import { Meta } from "antd/lib/list/Item";
import Img from "react-image";
import Identicon from "./Identicon";
import Jdenticon from "react-jdenticon";
import Mint from "./Mint";
import Transfer from "./Transfer";
import PayDividends from "./PayDividends";
import MoreCardOptions from "./MoreCardOptions";
import PayDividendsOption from "./PayDividendsOption";
import Paragraph from "antd/lib/typography/Paragraph";
import { OnBoarding } from "./OnBoarding";

async function sha256(message) {
  const bytes = new TextEncoder("utf-8").encode(message);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash));
}

const hammer = () => (
  <svg viewBox="0 0 576 512" width="18" height="18">
    <path
      fill="currentColor"
      d="M571.31 193.94l-22.63-22.63c-6.25-6.25-16.38-6.25-22.63 0l-11.31 11.31-28.9-28.9c5.63-21.31.36-44.9-16.35-61.61l-45.25-45.25c-62.48-62.48-163.79-62.48-226.28 0l90.51 45.25v18.75c0 16.97 6.74 33.25 18.75 45.25l49.14 49.14c16.71 16.71 40.3 21.98 61.61 16.35l28.9 28.9-11.31 11.31c-6.25 6.25-6.25 16.38 0 22.63l22.63 22.63c6.25 6.25 16.38 6.25 22.63 0l90.51-90.51c6.23-6.24 6.23-16.37-.02-22.62zm-286.72-15.2c-3.7-3.7-6.84-7.79-9.85-11.95L19.64 404.96c-25.57 23.88-26.26 64.19-1.53 88.93s65.05 24.05 88.93-1.53l238.13-255.07c-3.96-2.91-7.9-5.87-11.44-9.41l-49.14-49.14z"
    ></path>
  </svg>
);

const plane = () => (
  <svg height="18" width="18" viewBox="0 0 691.2 650.24">
    <defs id="defs74">
      <style id="style72" type="text/css" />
      <clipPath id="clipPath89" clipPathUnits="userSpaceOnUse">
        <rect
          y="192"
          x="177.60765"
          height="638.46899"
          width="654.39233"
          id="rect91"
          fill="currentColor"
        />
      </clipPath>
      <clipPath id="clipPath93" clipPathUnits="userSpaceOnUse">
        <rect
          y="192"
          x="177.60765"
          height="638.46899"
          width="654.39233"
          id="rect95"
          fill="currentColor"
        />
      </clipPath>
    </defs>
    <g transform="translate(-176.38277,-186.3533)" id="g99">
      <path
        fill="currentColor"
        d="M 192,499.2 404,592.6 832,192 Z"
        p-id="9782"
        id="path76"
        clip-path="url(#clipPath93)"
      />
      <path
        fill="currentColor"
        d="M 832,192 435.8,623.4 539.6,832 Z"
        p-id="9783"
        id="path78"
        clip-path="url(#clipPath89)"
      />
    </g>
  </svg>
);
const HammerIcon = props => <Icon component={hammer} {...props} />;
const PlaneIcon = props => <Icon component={plane} {...props} />;

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

  return (
    <Row type="flex" gutter={8} style={{ position: "relative" }}>
      {!loading && wallet && (
        <Col style={{ marginTop: "8px" }} xl={7} lg={12} span={24}>
          <EnhancedCard style={{ marginTop: "8px", textAlign: "left" }}>
            <Meta
              avatar={
                <Img
                  src="https://unstoppable.cash/wp-content/uploads/2018/03/12-bitcoin-cash-square-crop-small-GRN.png"
                  width="60"
                  height="60"
                  // style={{
                  //   marginTop: imageExists(`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`)
                  //     ? "-10px"
                  //     : null
                  // }}
                  // unloader={<Jdenticon size="64" value={token.tokenId} />}
                />
              }
              title={
                <div
                  style={{
                    float: "right"
                    // marginLeft: imageExists(`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`)
                    //   ? "60px"
                    //   : null
                  }}
                >
                  {/* <span>{token.balance} </span> */}
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
                  {/* <div>{token.info && token.info.name}</div> */}
                  <div
                    style={{
                      color: "rgb(62, 63, 66)",
                      fontSize: "16px",
                      fontWeight: "bold"
                      // marginLeft: imageExists(`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`)
                      //   ? "130px"
                      //   : "100px"
                    }}
                  >
                    {balances.balance + balances.unconfirmedBalance || "0"}
                  </div>
                </div>
              }
            />
          </EnhancedCard>
        </Col>
      )}
      {loading
        ? Array.from({ length: 20 }).map((v, i) => (
            <Col style={{ marginTop: "8px" }} xl={7} lg={12} span={24}>
              <EnhancedCard loading key={i} bordered={false}>
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
            <Col style={{ marginTop: "8px" }} xl={7} lg={12} sm={12} span={24}>
              <EnhancedCard
                loading={!token.info}
                expand={selectedToken && token.tokenId === selectedToken.tokenId}
                onClick={() =>
                  setSelectedToken(
                    !selectedToken || token.tokenId !== selectedToken.tokenId ? token : null
                  )
                }
                key={token.tokenId}
                style={{ marginTop: "8px", textAlign: "left" }}
                onClose={onClose}
                actions={[
                  <span onClick={() => setAction(action !== "transfer" ? "transfer" : null)}>
                    <PlaneIcon />
                    Send
                    {/* <span style={{marginTop:'-10px', transform:'tranlate(0, 20px)'}}>Send</span> */}
                  </span>,
                  token.info && token.info.hasBaton && (
                    <span onClick={() => setAction(action !== "mint" ? "mint" : null)}>
                      <HammerIcon /> Mint
                    </span>
                  ),
                  <span>
                    <MoreCardOptions
                      hoverContent={
                        <PayDividendsOption
                          onClick={evt => setAction(action !== "dividends" ? "dividends" : null)}
                        />
                      }
                    >
                      <span>
                        <Icon
                          style={{ fontSize: "22px", color: "rgb(158, 160, 165)" }}
                          type="ellipsis"
                          key="ellipsis"
                        />
                      </span>
                    </MoreCardOptions>
                  </span>
                ]}
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
                          style={{ tranform: "translate(-100px,100px)" }}
                          seed={token.tokenId}
                        />
                      }
                      // style={{
                      //   marginTop: imageExists(`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`)
                      //     ? "-10px"
                      //     : null
                      // }}
                      // unloader={<Jdenticon size="64" value={token.tokenId} />}
                    />
                  }
                  title={
                    <div
                      style={{
                        float: "right"
                        // marginLeft: imageExists(`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`)
                        //   ? "60px"
                        //   : null
                      }}
                    >
                      {/* <span>{token.balance} </span> */}
                      <div
                        style={{ fontSize: "16px", fontWeight: "bold", color: "rgb(62, 63, 66)" }}
                      >
                        {token.info && token.info.symbol.toUpperCase()}
                      </div>
                      <div
                        style={{
                          color: "rgb(158, 160, 165)",
                          fontSize: "12px",
                          fontWeight: "500",
                          whiteSpace: "nowrap"
                        }}
                      >
                        {token.info && token.info.name}
                      </div>
                    </div>
                  }
                  description={
                    <div>
                      {/* <div>{token.info && token.info.name}</div> */}
                      <div
                        style={{
                          color: "rgb(62, 63, 66)",
                          fontSize: "16px",
                          fontWeight: "bold"
                          // marginLeft: imageExists(`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`)
                          //   ? "130px"
                          //   : "100px"
                        }}
                      >
                        {token.balance.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")}
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
