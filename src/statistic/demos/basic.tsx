import React from 'react';
import { Statistic, Row, Col } from '@utech/born-ui';

export default () => (
  <Row>
    <Col span={6}>
      <Statistic title="金额" value={12300.1234} suffix="元" footer="Footer" />
    </Col>
    <Col span={6}>
      <Statistic title="金额" value={12300000.1234} suffix="元" />
    </Col>
    <Col span={6}>
      <Statistic
        title="面积"
        titleTip="我是tooltip提示"
        value={1230.1234}
        precision={0}
        suffix="㎡"
      />
    </Col>
  </Row>
);
