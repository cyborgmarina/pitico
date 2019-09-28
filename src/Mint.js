import React from "react";
import { BadgerContext } from "./badger/context";
import { mintToken } from "./badger/mintToken";
import { Table } from "antd";

const Mint = () => {
  const ContextValue = React.useContext(BadgerContext);
  const { wallet, tokens } = ContextValue;
  const columns = [
    {
      title: "Id",
      dataIndex: "tokenId",
      key: "tokenId",
      render: text => <a>{text}</a>
    },
    {
      title: "Action",
      key: "action",
      render: text => (
        <span>
          <a onClick={() => {
              mintToken(wallet, { tokenId: text.tokenId, qty: 1 })
          }}>
            Mint
          </a>
        </span>
      )
    }
  ];
  return <Table columns={columns} dataSource={tokens} />;
};

export default Mint;
