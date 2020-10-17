import React from 'react';
import { Select } from '@born/born-ui';
import { getDataWithoutPagination } from './service';

export default () => (
  <Select
    request={getDataWithoutPagination}
    transform={{ label: 'name', value: 'id' }}
    onChange={(...arg) => console.log(...arg)}
    mode="multiple"
    labelInValue
    style={{ width: 216 }}
  />
);
