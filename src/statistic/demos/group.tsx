import React from 'react';
import { Statistic } from '@utech/born-ui';

export default () => (
  <Statistic.Group>
    <Statistic title="金额1" value={11111.1234} suffix="元" />
    <Statistic title="金额2" value={22222.1234} suffix="元" />
    <Statistic title="金额3" value={33333.1234} suffix="元" />
    <Statistic title="金额4" value={44444.1234} suffix="元" />
    <Statistic title="金额5" value={55555.1234} suffix="元" />
    <Statistic title="金额6" value={66666.1234} suffix="元" />
  </Statistic.Group>
);
