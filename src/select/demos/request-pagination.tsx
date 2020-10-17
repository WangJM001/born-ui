import React from 'react';
import { Select } from '@born/born-ui';
import { getDataWithPagination } from './service';

export default () => (
  <Select
    request={getDataWithPagination}
    transform={{ label: 'name', value: 'id' }}
    onChange={(...arg) => console.log(...arg)}
    pagination
    style={{ width: 216 }}
  />
);
