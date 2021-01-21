import type { RequestPagingData } from '@utech/born-ui/interface';
import type { FilterType, SortType } from '@utech/born-ui/table';

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

export interface TableListItem {
  id: number;
  name: string;
  status: string | number;
  updatedAt: number;
  createdAt: number;
  money: number;
  percent: number | string;
  createdAtRange: number[];
}

export const tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 300; i += 1) {
  tableListDataSource.push({
    id: i,
    name: `TradeCode ${i}`,
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    updatedAt: Date.now() - Math.floor(Math.random() * 1000),
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    createdAtRange: [
      Date.now() - Math.floor(Math.random() * 20000000000),
      Date.now() + Math.floor(Math.random() * 2000000),
    ],
    money: Math.floor(Math.random() * 2000) * i,
    percent: Math.random(),
  });
}

export async function getTableListData(
  params: {
    pageNumber?: number;
    pageSize?: number;
  },
  sort?: SortType,
  filter?: FilterType,
): Promise<RequestPagingData<TableListItem>> {
  console.log(params, sort, filter);
  const { pageNumber = 1, pageSize = 0 } = params;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          items: tableListDataSource.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
          totalRow: tableListDataSource.length,
        },
        success: true,
      });
    }, 700);
  });
}
