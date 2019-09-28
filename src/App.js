import React from "react";
import "antd/dist/antd.css";
import "./index.css";
import { Layout, Menu, Icon } from "antd";
import Example from "./Component";
import "./App.css";

const { Header, Content, Sider } = Layout;

const App = () => {
  const [collapsed, setCollapesed] = React.useState(false);

  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={() => setCollapesed(!collapsed)}
        >
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
            <Menu.Item key="1">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="desktop" />
              <span>Option 2</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: "#fff", padding: 0 , fontSize:"24px"}} >
            Pitico Cash
            </Header>
          <Content style={{ margin: "0 16px" }}>
            <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
            <Example/>
            </div>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
};

export default App;
