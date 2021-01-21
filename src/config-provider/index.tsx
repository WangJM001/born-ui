import React from 'react';
import { ConfigProvider as AConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import type { ConfigConsumerProps } from './context';
import {
  ConfigConsumer,
  ConfigContext,
  defaultFormatSymbol,
  defaultTablePageSize,
} from './context';

dayjs.locale('zh-cn');

export { ConfigContext, ConfigConsumer };

export type ConfigProviderProps = Partial<ConfigConsumerProps>;

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const config: ConfigConsumerProps = {
    formatSymbol: props.formatSymbol || defaultFormatSymbol,
    tablePageSize: props.tablePageSize || defaultTablePageSize,
    emptyText: props.emptyText || '-',
  };
  return (
    <ConfigContext.Provider value={config}>
      <AConfigProvider locale={zhCN} input={{ autoComplete: 'off' }}>
        {props.children}
      </AConfigProvider>
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
