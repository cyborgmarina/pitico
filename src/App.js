import React from "react";
import "antd/dist/antd.less";
import "./index.css";
import { Layout, Menu, Icon, Typography, Radio } from "antd";
import Portfolio from "./Portfolio";
import { ButtonQR } from "badger-components-react";
import Create from "./Create";
import Configure from "./Configure";
import NotFound from "./NotFound";
import "./App.css";
import { WalletContext } from "./badger/context";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import styled from 'styled-components';

const { Header, Content, Sider } = Layout;
const { Paragraph } = Typography;

const App = () => {
  const [collapsed, setCollapesed] = React.useState(false);
  const [key, setKey] = React.useState(1);
  const [address, setAddress] = React.useState("slpAddress");
  const ContextValue = React.useContext(WalletContext);
  const { wallet } = ContextValue;

  React.useEffect(() => {
    const url = window.location.href.toString();
    if (url.includes("/", url.length - 1)) {
      setKey("0");
    } else if (url.includes("/portfolio", url.length - 10)) {
      setKey("0");
    } else if (url.includes("/create", url.length - 7)) {
      setKey("1");
    } else if (url.includes("/configure", url.length - 10)) {
      setKey("2");
    }
  }, []);

  const handleChange = e => {
    setKey(e.key);
  };

  const handleChangeAddress = e => {
    setAddress(e.target.value);
  };

const StyledWrapper = styled.div`
  ${ButtonQR} {
    button {
      display: none;
    }
  }
`;

  return (
    <Router>
      <div className="App">
        <Layout style={{ minHeight: "100vh" }}>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={() => setCollapesed(!collapsed)}
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
                <Link to="/portfolio">
                  {" "}
                  <Icon
                    style={{ fontSize: "16px" }}
                    type="appstore"
                    theme="filled"
                  />
                  <span>Portfolio</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="1">
                <Link to="/create">
                  {" "}
                  <Icon
                    style={{ fontSize: "16px" }}
                    type="plus-square"
                    theme="filled"
                  />
                  <span>Create</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/configure">
                  {" "}
                  <Icon
                    style={{ fontSize: "16px" }}
                    type="tool"
                    theme="filled"
                  />
                  <span>Configure</span>
                </Link>
              </Menu.Item>
            </Menu>
            {wallet ? (
              <div style={{ paddingTop: "120px" }}>
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
                <StyledWrapper>
                  <Paragraph>
                    <ButtonQR
                      toAddress={wallet[address]}
                      sizeQR={125}
                      steps={null}
                      amountSatoshis={0}
                    />
                  </Paragraph>
                </StyledWrapper>
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
                <Switch>
                  <Route exact path="/" component={Portfolio} />
                  <Route path="/portfolio" component={Portfolio} />
                  <Route path="/create" component={Create} />
                  <Route path="/configure" component={Configure} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
