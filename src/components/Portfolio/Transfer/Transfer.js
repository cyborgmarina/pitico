import React, { useState } from "react";
import { WalletContext } from "../../../utils/context";

import { Card, Icon, Form, Button, Spin, notification } from "antd";
import { Row, Col } from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import sendToken from "../../../utils/broadcastTransaction";
import { PlaneIcon } from "../../Common/CustomIcons";
import { FormItemWithMaxAddon, FormItemWithQRCodeAddon } from "../EnhancedInputs";

const Transfer = ({ token, onClose }) => {
  const { wallet } = React.useContext(WalletContext);
  const [formData, setFormData] = useState({
    dirty: true,
    quantity: "",
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
          <a href={link} target="_blank" rel="noopener noreferrer">
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
        message = "Invalid address";
      } else {
        message = e.message;
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

  const onMax = () => {
    setFormData({ ...formData, quantity: token.balance });
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
                  <FormItemWithQRCodeAddon
                    validateStatus={!formData.dirty && !formData.address ? "error" : ""}
                    help={
                      !formData.dirty && !formData.address ? "Should be a valid slp address" : ""
                    }
                    onScan={result => setFormData({ ...formData, address: result })}
                    inputProps={{
                      placeholder: "SLP Address",
                      name: "address",
                      onChange: e => handleChange(e),
                      required: true,
                      value: formData.address
                    }}
                  />

                  <FormItemWithMaxAddon
                    validateStatus={
                      !formData.dirty && Number(formData.quantity) <= 0 ? "error" : ""
                    }
                    help={
                      !formData.dirty && Number(formData.quantity) <= 0
                        ? "Should be greater than 0"
                        : ""
                    }
                    onMax={onMax}
                    inputProps={{
                      prefix: <Icon type="block" />,
                      placeholder: "Amount",
                      name: "quantity",
                      onChange: e => handleChange(e),
                      required: true,
                      type: "number",
                      value: formData.quantity
                    }}
                  />
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
