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
  console.log("hash", hash);
  return Array.from(new Uint8Array(hash));
}

const hammer = () => (
  // <svg t="1569182071957" viewBox="0 0 1024 1024" width="20" height="20">
  //   <defs>
  //     <style type="text/css"></style>
  //   </defs>
  //   <path
  //     d="M973.142857 273.142857q22.857143 32.571429 10.285714 73.714286l-157.142857 517.714286q-10.857143 36.571429-43.714285 61.428571T712.571429 950.857143H185.142857q-44 0-84.857143-30.571429T43.428571 845.142857q-13.714286-38.285714-1.142857-72.571428 0-2.285714 1.714286-15.428572t2.285714-21.142857q0.571429-4.571429-1.714285-12.285714t-1.714286-11.142857q1.142857-6.285714 4.571428-12t9.428572-13.428572T66.285714 673.714286q13.142857-21.714286 25.714286-52.285715t17.142857-52.285714q1.714286-5.714286 0.285714-17.142857t-0.285714-16q1.714286-6.285714 9.714286-16t9.714286-13.142857q12-20.571429 24-52.571429t14.285714-51.428571q0.571429-5.142857-1.428572-18.285714t0.285715-16q2.285714-7.428571 12.571428-17.428572t12.571429-12.857143q10.857143-14.857143 24.285714-48.285714T230.857143 234.857143q0.571429-4.571429-1.714286-14.571429t-1.142857-15.142857q1.142857-4.571429 5.142857-10.285714t10.285714-13.142857 9.714286-12q4.571429-6.857143 9.428572-17.428572t8.571428-20 9.142857-20.571428 11.142857-18.285715 15.142858-13.428571 20.571428-6.571429T354.285714 76.571429l-0.571428 1.714285q21.714286-5.142857 29.142857-5.142857h434.857143q42.285714 0 65.142857 32t10.285714 74.285714l-156.571428 517.714286q-20.571429 68-40.857143 87.714286T622.285714 804.571429H125.714286q-15.428571 0-21.714286 8.571428-6.285714 9.142857-0.571429 24.571429 13.714286 40 82.285715 40h527.428571q16.571429 0 32-8.857143t20-23.714286l171.428572-564q4-12.571429 2.857142-32.571428 21.714286 8.571429 33.714286 24.571428z m-608 1.142857q-2.285714 7.428571 1.142857 12.857143t11.428572 5.428572h347.428571q7.428571 0 14.571429-5.428572T749.142857 274.285714l12-36.571428q2.285714-7.428571-1.142857-12.857143t-11.428571-5.428572H401.142857q-7.428571 0-14.571428 5.428572T377.142857 237.714286z m-47.428571 146.285715q-2.285714 7.428571 1.142857 12.857142t11.428571 5.428572h347.428572q7.428571 0 14.571428-5.428572T701.714286 420.571429l12-36.571429q2.285714-7.428571-1.142857-12.857143t-11.428572-5.428571H353.714286q-7.428571 0-14.571429 5.428571T329.714286 384z"
  //     p-id="1216"
  //     fill="currentColor"
  //   ></path>
  // </svg>
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
// cont hasAvatar = tokenId =>{console.log(`${SLP_TOKEN_ICONS_URL}/${tokenId}.png`);};

const imageExists = image_url => {
  // var http = new XMLHttpRequest();

  // http.open("HEAD", image_url, false);
  // http.send();

  // return http.status !== 404;
  return false;
};
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
        ? Array.from({ length: 20 }).map((v, i) => (
            <Col style={{ marginTop: "8px" }} lg={7} span={24}>
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
            <Col style={{ marginTop: "8px" }} lg={7} span={24}>
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
                        style={{ color: "rgb(158, 160, 165)", fontSize: "12px", fontWeight: "500" }}
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
