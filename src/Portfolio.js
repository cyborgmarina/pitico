import React, { useState } from 'react'
import { Row, Col, Icon, Avatar, Card } from 'antd';
import { EnhancedCard } from './EnhancedCard';
import { WalletContext } from './badger/context';
import { Meta } from 'antd/lib/list/Item';
import Img from 'react-image';
import Jdenticon from 'react-jdenticon';

export default () => {
	const ContextValue = React.useContext(WalletContext);
	const { wallet, tokens, loading } = ContextValue;
	const [selectedToken, setSelectedToken] = useState(null);
	const SLP_TOKEN_ICONS_URL = "https://tokens.bch.sx/64";
	console.log(wallet);

	return (
		<Row type="flex" gutter={8} style={{ position:'relative' }}>
			{loading ? (
				Array.from({ length: 4 }).map((v, i) => (
					<Col>
						<Card
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
						</Card>
					</Col>
				))
			) : tokens.map(token => (
				<Col>
					<EnhancedCard
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
						avatar={<Img
									src={`${SLP_TOKEN_ICONS_URL}/${token.tokenId}.png`} 
									unloader={<Jdenticon size="64" value={token.tokenId}/>}/>}
						title="Token symbol"
						description="Token description"
						style={{color:"#fff"}}
					/>
				</EnhancedCard>
				</Col>
			))}
		</Row>
	)
};
