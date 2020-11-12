import React from 'react';
import { Row, Col, Trend } from '@utech/born-ui';
import Statistic from '@utech/born-ui/statistic/Statistic';

export default () => (
  <Row>
    <Col span={4}>
      <Statistic title="出租率" value={0.152} extra={<Trend flag="up" />} dataType="percent" />
    </Col>
    <Col span={4}>
      <Trend flag="up">95%</Trend>
    </Col>
    <Col span={4}>
      <Trend flag="down">15%</Trend>
    </Col>
    <Col span={4}>
      <Trend flag="up" colorful={false}>
        95%
      </Trend>
    </Col>
    <Col span={4}>
      <Trend flag="down" reverseColor>
        15%
      </Trend>
    </Col>
    <Col span={4}>
      <Trend flag="up" reverseColor>
        15%
      </Trend>
    </Col>
  </Row>
);
