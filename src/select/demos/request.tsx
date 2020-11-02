import React from 'react';
import { Select } from '@utech/born-ui';
import { getDataWithoutPagination } from './service';

export default () => (
  <Select
    request={getDataWithoutPagination}
    transform={{ label: 'name', value: 'id' }}
    onChange={(...arg) => console.log(...arg)}
    style={{ width: 216 }}
  />
);
