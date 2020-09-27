import React from 'react';

export type FormatSymbolType = {
  date: string;
  dateTime: string;
  year: string;
  quarter: string;
  month: string;
  week: string;
  currency: string;
  number: string;
  percent: string;
};

export interface ConfigConsumerProps {
  formatSymbol: FormatSymbolType;
  tablePageSize: number;
}

export const defaultFormatSymbol = {
  date: 'YYYY-MM-DD',
  dateTime: 'YYYY-MM-DD HH:mm:ss',
  year: 'YYYY',
  quarter: 'YYYY-QQ',
  month: 'YYYY-MM',
  week: 'YYYY-wo',
  currency: '0,0.00',
  number: '0,0[.]00',
  percent: '0[.]0%',
};

export const defaultTablePageSize = 10;

export const ConfigContext = React.createContext<ConfigConsumerProps>({
  formatSymbol: defaultFormatSymbol,
  tablePageSize: defaultTablePageSize,
});

export const ConfigConsumer = ConfigContext.Consumer;
