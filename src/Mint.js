import React from "react";
import { WalletContext } from "./badger/context";
import { mintToken } from "./badger/mintToken";
import { Card, Icon, Avatar, Table } from 'antd';
import { Row, Col } from 'antd';

const { Meta } = Card;

const Mint = () => {
  const ContextValue = React.useContext(WalletContext);
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

  return (
    <>
      <Table columns={columns} dataSource={tokens} />
      <Row type="flex" gutter={8}>
        {tokens.map(token => (
          <Col>
            <Card
            key={token.tokenId}
            style={{ width: 300 }}
            actions={[
              <span><Icon type="printer" key="printer"/> Mint</span>,
              <span><Icon type="interaction" key="interaction"/> Transfer</span>,
              <span><Icon type="ellipsis" key="ellipsis"/></span>,
            ]}
          >
            <Meta
              avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
              title="Token symbol"
              description="Token description"
            />
          </Card>
        </Col>
        ))}
      </Row>
    </>
  )
};

export default Mint;
