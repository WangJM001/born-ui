import React from 'react';
import { Descriptions } from '@born/born-ui';

export default () => (
  <Descriptions>
    <Descriptions.Item label="Label0">
      <div>123</div>
    </Descriptions.Item>
    <Descriptions.Item label="Label1">false</Descriptions.Item>
    <Descriptions.Item label="Label2">0</Descriptions.Item>
    <Descriptions.Item label="Label3">{}</Descriptions.Item>
    <Descriptions.Item label="Label4">{0}</Descriptions.Item>
  </Descriptions>
);
