import React from "react";
import { WalletContext } from "./badger/context";
import { Input, Button, notification, Spin, Icon, Row, Col, Card } from "antd";
import { createToken } from "./badger/createToken";
const Create = () => {
  const ContextValue = React.useContext(WalletContext);
  const { wallet } = ContextValue;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    tokenName: "",
    tokenSymbol: "",
    qty: ""
  });

  async function handleCreateToken() {
    setLoading(true);
    const { propstokenName, tokenSymbol, qty } = data;
    console.log("data", data);
    try {
      await createToken(wallet, {
        propstokenName,
        tokenSymbol,
        qty
      });

      notification.success({
        message: "Success",
        description: "Create Token Success"
      });
    } catch (e) {
      notification.error({
        message: "Error",
        description: `${e.message}`
      });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = e => {
    const { value, name } = e.target;

    setData(p => ({ ...p, [name]: value }));
  };
  return (
    <Spin spinning={loading}>
      <Row justify="center" type="flex">
         <Col span={8}>
          <Card title={<h2><Icon type="plus-square" theme="filled" /> Create</h2>} bordered={false}>
            <div>
              <Input
                placeholder="tokenName"
                name="tokenName"
                onChange={e => handleChange(e)}
              />
              <Input
                placeholder="tokenSymbol"
                name="tokenSymbol"
                onChange={e => handleChange(e)}
              />
              <Input placeholder="qty" name="qty" onChange={e => handleChange(e)} />
              <div style={{ paddingTop: "12px" }}>
                <Button onClick={() => handleCreateToken()}>Create Token</Button>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </Spin>
  );
};

export default Create;
