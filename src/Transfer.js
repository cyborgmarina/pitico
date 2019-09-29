import React, { useState } from "react";
import styled from "styled-components";
import { ButtonQR } from "badger-components-react";
import { WalletContext } from "./badger/context";
import { mintToken } from "./badger/mintToken";
import { Card, Icon, Avatar, Table, Form, Input, Button, Alert, Select, Spin, notification } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import Text from "antd/lib/typography/Text";
import { sendToken } from "./badger/sendToken";

const InputGroup = Input.Group;
const { Meta } = Card;
const { Option } = Select;


const Transfer = ({ token, onClose }) => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet, tokens, balances } = ContextValue;
  const [formData, setFormData] = useState({
    dirty: true,
    quantity: 0,
    address: ''
  });
  const [loading, setLoading] = useState(false);

  async function submit() {
    setFormData({
      ...formData,
      dirty: false
    });

    if (
      !formData.address ||
      !formData.quantity ||
      Number(formData.quantity) <= 0
    ) {
      return;
    }

    setLoading(true);
    const {quantity, address } = formData;

    try {
      const link = await sendToken(wallet, {
        tokenId: token.tokenId,
        quantity,
        address,
      });

      notification.success({
        message: "Success",
        description:
        (
          <a href={link} target="_blank">
            <Paragraph>
              Transaction successful. It might take a little bit to show up on your portfolio. 
              You can verify this transaction here: {link}
            </Paragraph>
          </a>
        ),
        duration: 0
      });

      onClose();
      setLoading(false);
    } catch (e) {
      let message;

      if(/don't have the minting baton/.test(e.message)) {
        message = e.message;
      } else if(/has no matching Script/.test(e.message)) {
        message = 'Invalid BCH address';
      } else {
        message = "Unknown Error, try again later";
      }

      notification.error({
        message: "Error",
        description: message
      });
      console.error(e.message);
      setLoading(false);
    }
  };

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
              <Icon type="interaction" theme="filled" /> Transfer
            </h2>
          }
          bordered={false}
        >
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
                  !formData.dirty && !formData.address
                    ? "Should be a valid slp address"
                    : ""
                }
              >
                <Input
                  prefix={<Icon type="wallet" />}
                  placeholder="address"
                  name="address"
                  onChange={e => handleChange(e)}
                  required
                />
              </Form.Item>
                <div style={{ paddingTop: "12px" }}>
                  <Button onClick={() => submit()}>Transfer</Button>
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
