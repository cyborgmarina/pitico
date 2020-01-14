import React from "react";
import { Row, Col, Card, Icon, Typography } from "antd";
import StyledAudit from "../Common/StyledPage";
const { Text, Title } = Typography;

export default () => {
  return (
    <StyledAudit>
      <Row justify="center" type="flex">
        <Col lg={8} span={24}>
          <Card
            className="audit"
            title={
              <h2>
                <Icon type="eye" theme="filled" /> Audit
              </h2>
            }
            bordered={false}
          >
            <Title level={4}>Never trust, always verify.</Title>
            <Text>
              Check the open source code{" "}
              <a
                href="https://github.com/Bitcoin-com/mint"
                rel="noopener noreferrer"
                target="_blank"
              >
                here
              </a>
              .
            </Text>
            <br />
            <Text>Check and/or change the REST API in Configure. </Text>
            <br />
            <Text>
              Install, build and run Bitcoin.com Mint{" "}
              <a
                href="https://github.com/Bitcoin-com/mint#running-locally"
                rel="noopener noreferrer"
                target="_blank"
              >
                locally
              </a>
              .{" "}
            </Text>
            <br />
            <Text>
              Join our{" "}
              <a href="https://t.me/piticocash" rel="noopener noreferrer" target="_blank">
                public telegram group
              </a>
              .
            </Text>
          </Card>
        </Col>
      </Row>
    </StyledAudit>
  );
};
