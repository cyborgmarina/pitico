import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Layout, Menu, Icon } from "antd";
import Mint from "./Mint";
import Home from "./Home";
import Create from "./Create";
import PayDividends from "./PayDividends";
import Portfolio from "./Portfolio";
import "./App.css";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapesed] = React.useState(false);

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
              defaultSelectedKeys={["1"]}
              style={{ textAlign: "left" }}
            >
              <Menu.Item key="0">
                <Link to="/">
                  {" "}
		  <Icon style={{ fontSize: '16px'}} type="appstore" theme="filled"/>
                  <span>Portfolio</span>
                </Link>
	      </Menu.Item>
              <Menu.Item key="1">
                <Link to="/create">
                  {" "}
                  <Icon style={{ fontSize: '18px'}} type="build" theme="filled" />
                  <span>Create</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/configure">                  
                {" "}
                  <Icon style={{ fontSize: '16px'}} type="tool" theme="filled" />
                  <span>Configure</span>
                </Link>
              </Menu.Item>
            </Menu>
          </Sider>
	  <Layout style={{ background: "#f0f2f5" }}>
            <Header
              style={{ background: "#f0f2f5", padding: 0, fontSize: "24px" }}
            >
              pitico.cash
            </Header>
            <Content style={{ margin: "0 16px" }}>
              <div style={{ padding: 24, background: "#f0f2f5", minHeight: 360 }}>
                <Route exact path="/" component={Portfolio} />
                <Route path="/create" component={Create} />
                <Route path="/configure" component={Portfolio}/>

              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </Router>
  );
};

export default App;
