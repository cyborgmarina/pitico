import React from "react";
import "antd/dist/antd.less";
import "../index.css";
import { Layout, Menu, Icon, Typography, Radio, List, Skeleton } from "antd";
import Portfolio from "./Portfolio";
import { ButtonQR } from "badger-components-react";
import Create from "./Create";
import Configure from "./Configure";
import Audit from "./Audit";
import NotFound from "./NotFound";
import "./App.css";
import { WalletContext } from "../utils/context";
import logo from "./logo.png";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import styled from "styled-components";
import { QRCode } from "./QRCode";
import Text from "antd/lib/typography/Text";

const { Header, Content, Sider } = Layout;
const { Paragraph } = Typography;

const App = () => {
  const [collapsed, setCollapesed] = React.useState(false);
  const [key, setKey] = React.useState("0");
  const [address, setAddress] = React.useState("slpAddress");
  const ContextValue = React.useContext(WalletContext);
  const { wallet, balances, loading } = ContextValue;

  const handleChange = e => {
    setKey(e.key);
  };

  const handleChangeAddress = e => {
    setAddress(e.target.value);
  };

  const route = () => {
    switch (key) {
      case "0":
        return <Portfolio />;
      case "1":
        return <Create />;
      case "2":
        return <Configure />;
      case "3":
        return <Audit />;
      default:
        return <NotFound />;
    }
  };

  return (
    <Router>
      <div className="App">
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            // style={{ maxWidth: "256px", minWidth: "256px", width: "256px" }}
          >
            <div className="logo">
              <img src={logo} alt="Bitcoin.com Mint" />
            </div>
            <div
              style={{
                background: "rgba(0, 0, 0, 0.5)",
                width: "100%",
                height: "1px",
                marginBottom: "26px",
                marginTop: "19px"
              }}
            />
            <Menu
              theme="dark"
              selectedKeys={[key]}
              onClick={e => handleChange(e)}
              defaultSelectedKeys={["1"]}
              style={{ textAlign: "left" }}
            >
              <Menu.ItemGroup style={{ marginTop: "0px" }} key="menu" title="MENU">
                <Menu.Item key="0">
                  <span>Portfolio</span>
                </Menu.Item>
                <Menu.Item key="1">
                  <span>Create</span>
                </Menu.Item>
                <Menu.Item key="2">
                  <span>Configure</span>
                </Menu.Item>
                <Menu.Item key="3">
                  <span>Audit</span>
                </Menu.Item>
              </Menu.ItemGroup>

              {wallet ? (
                <Menu.ItemGroup
                  style={{ position: "absolute", bottom: "43px" }}
                  key="menu"
                  title="RECEIVE"
                >
                  <div style={{ marginLeft: "20px", paddingTop: "10px" }}>
                    <div>
                      <QRCode
                        id="borderedQRCode"
                        address={address === "slpAddress" ? wallet.slpAddress : wallet.cashAddress}
                      />
                    </div>
                    <Radio.Group
                      defaultValue="slpAddress"
                      onChange={e => handleChangeAddress(e)}
                      value={address}
                      size="small"
                      buttonStyle="solid"
                    >
                      <Radio.Button
                        style={{ borderRadius: "19.5px", height: "40px", width: "103px" }}
                        value="slpAddress"
                      >
                        SLP Tokens
                      </Radio.Button>
                      <Radio.Button
                        style={{ borderRadius: "19.5px", height: "40px", width: "103px" }}
                        value="cashAddress"
                      >
                        Bitcoin Cash
                      </Radio.Button>
                    </Radio.Group>
                    {/* {!loading ? (
                  <List
                    style={{ marginTop: 16 }}
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={[
                      {
                        title: "BCH",
                        description: balances.balance + balances.unconfirmedBalance || "0"
                      }
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta title={item.title} description={item.description} />
                      </List.Item>
                    )}
                  />
                ) : null} */}
                  </div>
                </Menu.ItemGroup>
              ) : null}
            </Menu>
          </Sider>
          <Layout style={{ backgroundColor: "#FBFBFD" }}>
            <Header
              style={{
                background: "#FBFBFD",
                fontSize: "24px",
                color: "#fff"
              }}
            >
              <div
                style={{
                  display: "inline",
                  paddingRight: "4px",
                  paddingTop: "32px"
                }}
              ></div>

              <span style={{ display: "inline" }}>pitico.cash</span>
            </Header>
            <Content style={{ margin: "0 16px", backgroundColor: "#FBFBFD" }}>
              <div
                style={{
                  padding: 24,
                  background: "#f0f2f5",
                  minHeight: 360,
                  backgroundColor: "#FBFBFD"
                }}
              >
                {route()}
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
