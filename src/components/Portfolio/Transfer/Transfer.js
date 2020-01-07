import React, { useState } from "react";
import { WalletContext } from "../../../utils/context";

import { Card, Icon, Form, Input, Button, Spin, notification } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import sendToken from "../../../utils/broadcastTransaction";
import { PlaneIcon } from "../../Common/CustomIcons";

const Transfer = ({ token, onClose }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet } = ContextValue;
  const [formData, setFormData] = useState({
    dirty: true,
    quantity: 0,
    address: ""
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (!formData.address || !formData.quantity || Number(formData.quantity) <= 0) {
      return;
    }

    setLoading(true);
    const { quantity, address } = formData;

    try {
      const link = await sendToken(wallet, {
        tokenId: token.tokenId,
        amount: quantity,
        tokenReceiverAddress: address
      });

      notification.success({
        message: "Success",
        description: (
          <a href={link} target="_blank">
            <Paragraph>Transaction successful. Click or tap here for more details</Paragraph>
          </a>
        ),
        duration: 2
      });

      onClose();
      setLoading(false);
    } catch (e) {
      let message;

      if (/don't have the minting baton/.test(e.message)) {
        message = e.message;
      } else if (/has no matching Script/.test(e.message)) {
        message = "Invalid BCH address";
      } else {
        message = "Unknown Error, try again later";
      }

      notification.error({
        message: "Error",
        description: message,
        duration: 2
      });
      console.error(e.message);
      setLoading(false);
    }
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setFormData(p => ({ ...p, [name]: value }));
  };

  return (
    <Row type="flex">
      <Col span={24}>
        <Spin spinning={loading}>
          <Card
            title={
              <h2>
                <PlaneIcon /> Send
              </h2>
            }
            bordered={false}
          >
            <br />
            <Row type="flex">
              <Col span={24}>
                <Form style={{ width: "auto" }}>
                  <Form.Item
                    validateStatus={
                      !formData.dirty && Number(formData.quantity) <= 0 ? "error" : ""
                    }
                    help={
                      !formData.dirty && Number(formData.quantity) <= 0
                        ? "Should be greater than 0"
                        : ""
                    }
                  >
                    <Input
                      prefix={<Icon type="block" />}
                      placeholder="quantity"
                      name="quantity"
                      onChange={e => handleChange(e)}
                      required
                      type="number"
                    />
                  </Form.Item>
                  <Form.Item
                    validateStatus={!formData.dirty && !formData.address ? "error" : ""}
                    help={
                      !formData.dirty && !formData.address ? "Should be a valid slp address" : ""
                    }
                  >
                    <Input
                      prefix={<Icon type="wallet" />}
                      placeholder="slp address"
                      name="address"
                      onChange={e => handleChange(e)}
                      required
                    />
                  </Form.Item>
                  <div style={{ paddingTop: "12px" }}>
                    <Button onClick={() => submit()}>Send</Button>
                  </div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Spin>
      </Col>
    </Row>
  );
};

export default Transfer;
