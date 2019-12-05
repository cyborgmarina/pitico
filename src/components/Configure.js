import React, { useState } from "react";
import { Row, Col, Card, Icon, Alert, Typography, Form, Input, Button, Collapse } from "antd";
import styled from "styled-components";
import { WalletContext } from "../utils/context";
const { Paragraph } = Typography;
const { Panel } = Collapse;

const StyledConfigure = styled.div`
  .ant-card {
    background: #ffffff;
    box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.35);
    overflow: hidden;

    * {
      color: rgb(62, 63, 66);
    }

    .ant-card-head {
      color: #6e6e6e !important;
      background: #fbfcfd;
      border-bottom: 1px solid #eaedf3;
    }

    .ant-alert {
      background: #fbfcfd;
      border: 1px solid #eaedf3;
    }
  }
  .ant-card-body {
    border: none;
  }
  .ant-collapse {
    background: #fbfcfd;
    border: 1px solid #eaedf3;

    .ant-collapse-content {
      border: 1px solid #eaedf3;
      border-top: none;
    }

    .ant-collapse-item {
      border-bottom: 1px solid #eaedf3;
    }

    * {
      color: rgb(62, 63, 66) !important;
    }
  }
`;

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
    <StyledConfigure>
      <Row justify="center" type="flex">
        <Col lg={8} span={24}>
          <Card
            style={{ borderRadius: "8px" }}
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
                    <Paragraph>Backup your wallet first.</Paragraph>
                    <Paragraph>Updating the configuration will restart the app.</Paragraph>
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
                  placeholder={data.restAPI || "https://rest.bitcoin.com"}
                  name="restAPI"
                  onChange={e => handleChange(e)}
                  required
                />
              </Form.Item>
              <div style={{ paddingTop: "12px", marginBottom: "10px" }}>
                <Button onClick={() => handleConfigure()}>Update REST API</Button>
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
    </StyledConfigure>
  );
};
