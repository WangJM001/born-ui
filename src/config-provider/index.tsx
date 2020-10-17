import React from 'react';
import { ConfigProvider as AConfigProvider } from 'antd';
import zhCN from 'antd/lib/locale/zh_CN';
import {
  ConfigConsumer,
  ConfigConsumerProps,
  ConfigContext,
  defaultFormatSymbol,
  defaultTablePageSize,
} from './context';

export { ConfigContext, ConfigConsumer };

export interface ConfigProviderProps extends Partial<ConfigConsumerProps> {}

const ConfigProvider: React.FC<ConfigProviderProps> = (props) => {
  const config: ConfigConsumerProps = {
    formatSymbol: props.formatSymbol || defaultFormatSymbol,
    tablePageSize: props.tablePageSize || defaultTablePageSize,
    emptyText: props.emptyText || '-',
  };
  return (
    <ConfigContext.Provider value={config}>
      <AConfigProvider locale={zhCN}>{props.children}</AConfigProvider>
    </ConfigContext.Provider>
  );
};

export default ConfigProvider;
