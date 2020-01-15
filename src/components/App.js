import React from "react";
import "antd/dist/antd.less";
import "../index.css";
import { Layout, Menu, Radio } from "antd";
import Portfolio from "./Portfolio/Portfolio";
import Create from "./Create/Create";
import Configure from "./Configure/Configure";
import Audit from "./Audit/Audit";
import NotFound from "./NotFound";
import "./App.css";
import { WalletContext } from "../utils/context";
import logo from "../assets/logo.png";
import { BrowserRouter as Router } from "react-router-dom";
import { QRCode } from "./Common/QRCode";

const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapesed] = React.useState(window.innerWidth < 768);
  const [mobile, setMobile] = React.useState(false);
  const [key, setKey] = React.useState("0");
  const [address, setAddress] = React.useState("slpAddress");
  const ContextValue = React.useContext(WalletContext);
  const { wallet } = ContextValue;
  const radio = React.useRef(null);
  const handleChange = e => {
    if (e.key < 4) setKey(e.key);
    setTimeout(() => mobile && setCollapesed(true), 100);
  };

  const handleChangeAddress = e => {
    setAddress(address === "cashAddress" ? "slpAddress" : "cashAddress");
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

  const handleResize = () => setMobile(window.innerWidth < 768);

  React.useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            collapsed={collapsed}
            onCollapse={() => setCollapesed(!collapsed)}
            width="256"
            // style={{ flex: "0 0 256px" }}
            style={mobile ? { position: "absolute", zIndex: "2", height: "100vh" } : null}
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
                <Menu.SubMenu key="4" title={<span>Links</span>}>
                  <Menu.Item key="5">
                    <a href="https://exchange.bitcoin.com/" target="_blank">
                      Exchange
                    </a>
                  </Menu.Item>
                  <Menu.Item key="6">
                    {" "}
                    <a href="https://cashgames.bitcoin.com/home" target="_blank">
                      Games
                    </a>
                  </Menu.Item>
                  <Menu.Item key="7">
                    {" "}
                    <a href="https://local.bitcoin.com" target="_blank">
                      Trade Locally
                    </a>
                  </Menu.Item>
                </Menu.SubMenu>
              </Menu.ItemGroup>

              {wallet ? (
                <Menu.ItemGroup key="menu-receive" title="RECEIVE">
                  <div
                    style={{
                      marginLeft: "20px",
                      paddingTop: "10px"
                      // display: `${window.innerWidth > 768 ? "none" : null}`
                    }}
                  >
                    <div>
                      <QRCode
                        id="borderedQRCode"
                        address={address === "slpAddress" ? wallet.slpAddress : wallet.cashAddress}
                      />
                    </div>

                    <Radio.Group
                      defaultValue="slpAddress"
                      // onChange={e => handleChangeAddress(e)}
                      value={address}
                      size="small"
                      buttonStyle="solid"
                      ref={radio}
                    >
                      <Radio.Button
                        style={{
                          borderRadius: "19.5px",
                          height: "40px",
                          width: "103px"
                        }}
                        value="slpAddress"
                        onClick={e => handleChangeAddress(e)}
                      >
                        SLP Tokens
                      </Radio.Button>
                      <Radio.Button
                        style={{
                          borderRadius: "19.5px",
                          height: "40px",
                          width: "103px"
                        }}
                        value="cashAddress"
                        onClick={e => handleChangeAddress(e)}
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
            </Header>
            <Content style={{ margin: "0 16px", backgroundColor: "#FBFBFD" }}>
              <div
                style={{
                  padding: 24,
                  minHeight: 360
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
