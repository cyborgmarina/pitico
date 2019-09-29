import React, { useState } from 'react'
import { Row, Col, Card, Icon, Alert, Typography, Form, Input, Button } from 'antd';
const { Paragraph } = Typography;

export default () => {
	const [visible, setVisible] = useState(true);
	const handleClose = () => setVisible(false);
	const [loading, setLoading] = React.useState(false);
	const [data, setData] = React.useState({
		dirty: true,
		restAPI: "",
	});

	const handleConfigure = () => {};
	const handleChange = e => {
		const { value, name } = e.target;

		setData(p => ({ ...p, [name]: value }));
	};

	return (
		<Row justify="center" type="flex">
		<Col span={8}>
		<Card title={<h2><Icon type="tool" theme="filled" /> Configure</h2>} bordered={false}>
		{visible ? (
			<Alert
			message={<span><Paragraph><Icon type="warning" /> Be careful.</Paragraph><Paragraph>This is for experienced users.</Paragraph></span>}
			type="warning"
			closable
			afterClose={handleClose}
			/>
			) : null}
			<Form>
			<Form.Item
			validateStatus={!data.dirty && !data.restAPI? "error" : ""}
			help={
				!data.dirty && !data.restAPI
				? "Should be something like https://rest.bitcoin.com"
				: ""
			}
			>
			<Input
			placeholder="Rest API"
			name="restAPI"
			onChange={e => handleChange(e)}
			required
			/>
			</Form.Item>
			<div style={{ paddingTop: "12px" }}>
			<Button onClick={() => handleConfigure()}>
			Update Config
			</Button>
			</div>
			</Form>
			</Card>
			</Col>
			</Row>)
		}