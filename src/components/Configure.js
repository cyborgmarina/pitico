import React, { useState } from "react";
import { Row, Col, Card, Icon, Alert, Typography, Form, Input, Button, Collapse } from "antd";
import { WalletContext } from "../utils/context";
const { Paragraph } = Typography;
const { Panel } = Collapse;

export default () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet } = ContextValue;
  const [visible, setVisible] = useState(true);
  const handleClose = () => setVisible(false);
  const [isConfigUpdated, setIsConfigUpdated] = React.useState(false);
  const [data, setData] = React.useState({
    dirty: true,
    restAPI: window.localStorage.getItem("restAPI")
  });

  const handleConfigure = () => {
    window.localStorage.setItem("restAPI", data.restAPI);
    setIsConfigUpdated(true);
    window.localStorage.setItem("wallet", null);
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };
  const handleChange = e => {
    const { value, name } = e.target;

    setData(p => ({ ...p, [name]: value }));
  };

  return (
    <Row justify="center" type="flex">
      <Col lg={8} span={24}>
        <Card
          title={
            <h2>
              <Icon type="tool" theme="filled" /> Configure
            </h2>
          }
          bordered={false}
        >
          {visible ? (
            <Alert
              style={{ marginBottom: "10px" }}
              message={
                <span>
                  <Paragraph>
                    <Icon type="warning" /> Be careful.
                  </Paragraph>
                  <Paragraph>This is for experienced users.</Paragraph>
                </span>
              }
              type="warning"
              closable
              afterClose={handleClose}
            />
          ) : null}
          <Form>
            <Form.Item
              validateStatus={!data.dirty && !data.restAPI ? "error" : ""}
              help={
                !data.dirty && !data.restAPI
                  ? "Should be something like https://rest.bitcoin.com"
                  : ""
              }
            >
              <Input
                placeholder={data.restAPI}
                name="restAPI"
                onChange={e => handleChange(e)}
                required
              />
            </Form.Item>
            <div style={{ paddingTop: "12px", marginBottom: "10px" }}>
              <Button onClick={() => handleConfigure()}>Update Config</Button>
              {isConfigUpdated && (
                <Paragraph>
                  Your configuration has been updated. Now connecting to {data.restAPI}...
                </Paragraph>
              )}
            </div>
          </Form>

          <Collapse>
            <Panel header="Seed Phrase (Mnemonic)" key="1">
              <p>{wallet && wallet.mnemonic ? wallet.mnemonic : ""}</p>
            </Panel>
          </Collapse>
        </Card>
      </Col>
    </Row>
  );
};
