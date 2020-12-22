import React from 'react';
import { Descriptions } from '@utech/born-ui';

export default () => (
  <Descriptions>
    <Descriptions.Item label="Label1">Value1</Descriptions.Item>
    <Descriptions.Item label="Label2">Value2</Descriptions.Item>
    <Descriptions.Item label="Label3">Value3</Descriptions.Item>
    <Descriptions.Item label="Label4">Value4</Descriptions.Item>
    <Descriptions.Item label="Label5">Value5</Descriptions.Item>
    <Descriptions.Item label="Label6">Value6</Descriptions.Item>
    <Descriptions.Item label="Label7" tip="我是提示信息">
      Value7
    </Descriptions.Item>
    <Descriptions.Item label="Label8">Value8</Descriptions.Item>
    <Descriptions.Item label="Label9" suffix="SUFFIX">
      Value9
    </Descriptions.Item>
  </Descriptions>
);
