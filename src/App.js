import React from "react";
import "antd/dist/antd.less";
import "./index.css";
import { Layout, Menu, Icon, Typography, Radio, List, Skeleton } from "antd";
import Portfolio from "./Portfolio";
import { ButtonQR } from "badger-components-react";
import Create from "./Create";
import Configure from "./Configure";
import NotFound from "./NotFound";
import "./App.css";
import { WalletContext } from "./badger/context";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import styled from 'styled-components';
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
        return <Portfolio />
      case "1":
        return <Create />
      case "2":
        return <Configure />
      default:
        return <NotFound />
    }
  }

  return (
    <Router>
      <div className="App">
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
          >
            <div className="logo" />
            <Menu
              theme="dark"
              selectedKeys={[key]}
              onClick={e => handleChange(e)}
              defaultSelectedKeys={["1"]}
              style={{ textAlign: "left" }}
            >
              <Menu.Item key="0">
                  {" "}
                  <Icon
                    style={{ fontSize: "16px" }}
                    type="appstore"
                    theme="filled"
                  />
                  <span>Portfolio</span>
              </Menu.Item>
              <Menu.Item key="1">
                  {" "}
                  <Icon
                    style={{ fontSize: "16px" }}
                    type="plus-square"
                    theme="filled"
                  />
                  <span>Create</span>
              </Menu.Item>
              <Menu.Item key="2">
                  {" "}
                  <Icon
                    style={{ fontSize: "16px" }}
                    type="tool"
                    theme="filled"
                  />
                  <span>Configure</span>
              </Menu.Item>
            </Menu>
            {wallet ? (
              <div style={{ paddingTop: "120px" }}>
                <div>
                  <QRCode address={address === 'slpAddress' ? wallet.slpAddress : wallet.cashAddress} />
                </div>
                <Radio.Group
                  defaultValue="slpAddress"
                  onChange={(e) => handleChangeAddress(e)}
                  value={address}
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button style={{ borderRadius: 0 }} value="slpAddress">SLP</Radio.Button>
                  <Radio.Button style={{ borderRadius: 0 }} value="cashAddress">BCH</Radio.Button>
                </Radio.Group>
                {!loading ? (
                  <List
                    style={{ marginTop: 16 }}
                    loading={loading}
                    itemLayout="horizontal"
                    dataSource={[
                      { title: 'BCH', description: balances.balance + balances.unconfirmedBalance || '0' },
                    ]}
                    renderItem={item => (
                      <List.Item>
                        <List.Item.Meta
                          title={item.title}
                          description={item.description}
                        />
                      </List.Item>
                    )}
                  />
                ) : null}
              </div>
            ) : null}
          </Sider>
          <Layout style={{ backgroundColor: "#171717" }}>
            <Header
              style={{
                background: "#171717",
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
              >
              </div>

              <span style={{ display: "inline" }}>pitico.cash</span>
            </Header>
            <Content style={{ margin: "0 16px", backgroundColor: "#171717" }}>
              <div
                style={{
                  padding: 24,
                  background: "#f0f2f5",
                  minHeight: 360,
                  backgroundColor: "#171717"
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
