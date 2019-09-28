import React from 'react'
import { Row, Col } from 'antd';
import { Card } from 'antd';

export default () => (
    <div>
	<Row gutter={16}>
	    <Col className="gutter-row" span={6}>
		<div className="gutter-box">
		    <Card size="small" title="PLCHD" bordered={false} style={{ width: 200 }}>
			<p><strong>10</strong> Placeholders</p>
		    </Card>
		</div>
	    </Col>
	    <Col className="gutter-row" span={6}>

		<div className="gutter-box">
		    <Card size="small" title="PLCHD" bordered={false} style={{ width: 200 }}>
			<p><strong>10</strong> Placeholders</p>
		    </Card>
		</div>

	    </Col>
	    <Col className="gutter-row" span={6}>
		<div className="gutter-box">
		    <Card size="small" title="PLCHD" bordered={false} style={{ width: 200 }}>
			<p><strong>10</strong> Placeholders</p>
			<p><strong>* Baton Holder</strong></p>
		    </Card>
		</div>
	    </Col>
	    <Col className="gutter-row" span={6}>
		<div className="gutter-box">
		    <Card size="small" title="PLCHD" bordered={false} style={{ width: 200 }}>
			<p><strong>500</strong> Placeholders</p>
		    </Card>
		</div>
	    </Col>
	</Row>
    </div>
)



