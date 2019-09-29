import React, { useState } from 'react'
import { Row, Col, Icon, Avatar, Card } from 'antd';
import { EnhancedCard } from './EnhancedCard';
import { WalletContext } from './badger/context';
import { Meta } from 'antd/lib/list/Item';
import Jdenticon from 'react-jdenticon';

export default () => {
	const ContextValue = React.useContext(WalletContext);
	const { wallet, tokens, loading } = ContextValue;

	const [selectedToken, setSelectedToken] = useState(null);

	return (
		<Row type="flex" gutter={8} style={{ position:'relative' }}>
			{loading ? (
				Array.from({ length: 4 }).map((v, i) => (
					<Col>
						<EnhancedCard
							loading
							key={i}
							style={{ width: 300, marginTop: '8px' }}
							bordered={false}
						>
							<Meta
								avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
								title="Token symbol"
								description="Token description"
							/>
						</EnhancedCard>
					</Col>
				))
			) : tokens.map(token => (
				<Col>
					<EnhancedCard
						loading={!token.info}
						expand={selectedToken && token.tokenId === selectedToken.tokenId}
						onClick={() => setSelectedToken(!selectedToken || token.tokenId !== selectedToken.tokenId ? token : null)}
						key={token.tokenId}
						style={{ width: 300, marginTop: '8px', textAlign: 'left' }}
						onClose={() => setSelectedToken(null)}
						actions={[
							<span><Icon type="printer" key="printer"/> Mint</span>,
							<span><Icon type="interaction" key="interaction"/> Transfer</span>,
							<span><Icon type="ellipsis" key="ellipsis"/></span>,
						]}
					>
					<Meta
						avatar={<Jdenticon size="48" value={token.tokenId} />}
						title={token.info && token.info.symbol}
						description={token.info && token.info.name}
					/>
				</EnhancedCard>
				</Col>
			))}
		</Row>
	)
};
