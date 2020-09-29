import React, { FC } from 'react';
import { Empty as AEmpty } from 'antd';
import { EmptyProps } from 'antd/lib/empty';

export * from 'antd/lib/empty';

interface EmptyType extends FC<EmptyProps> {
  PRESENTED_IMAGE_DEFAULT: React.ReactNode;
  PRESENTED_IMAGE_SIMPLE: React.ReactNode;
}

const Empty: EmptyType = (props) => {
  return <AEmpty image={AEmpty.PRESENTED_IMAGE_SIMPLE} {...props} />;
};

Empty.PRESENTED_IMAGE_DEFAULT = AEmpty.PRESENTED_IMAGE_DEFAULT;
Empty.PRESENTED_IMAGE_SIMPLE = AEmpty.PRESENTED_IMAGE_SIMPLE;

export default Empty;
