import React from 'react'
import { Row, Col, Card, Icon } from 'antd';


 export default () => (
 	<Row justify="center" type="flex">
		 <Col span={8}>
 			<Card title={<h2><Icon type="tool" theme="filled" /> Configure</h2>} bordered={false}>
				<p>Configuration Placeholder</p>
			</Card>
		</Col>
	</Row>)
