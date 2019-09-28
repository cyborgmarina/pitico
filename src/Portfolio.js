import React from 'react'
import { Row, Col, Icon, Avatar } from 'antd';
import { Card } from 'antd';
import { WalletContext } from './badger/context';
import { Meta } from 'antd/lib/list/Item';

export default () => {
	const ContextValue = React.useContext(WalletContext);
	const { wallet, tokens, loading } = ContextValue;

	return (
		<Row type="flex" gutter={8}>
			{loading ? (
				Array.from({ length: 8 }).map((v, i) => (
					<Col>
						<Card
						loading
						key={i}
						style={{ width: 300, marginTop: '8px' }}
						>
						<Meta
							avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
							title="Token symbol"
							description="Token description"
						/>
					</Card>
					</Col>
				))
			) : tokens.map(token => (
				<Col>
					<Card
					key={token.tokenId}
					style={{ width: 300, marginTop: '8px' }}
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
	)
};
