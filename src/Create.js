import React from "react";
import { BadgerContext } from "./badger/context";
import { Input, Button, notification, Spin } from "antd";
import { createToken } from "./badger/createToken";
const Create = () => {
  const ContextValue = React.useContext(BadgerContext);
  const { wallet } = ContextValue;
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState({
    tokenName: "",
    tokenSymbol: "",
    qty: ""
  });

  //   createToken(w, { tokenName: "hahaha", tokenSymbol: "hahaha", qty: 1000 });
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
      <div style={{ padding: "12px 40% 64px 40%" }}>
        <h2>Create</h2>
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
      </div>
    </Spin>
  );
};

export default Create;
