import { RequestListData, RequestPagingData } from '@born/born-ui/interface';

export interface DataItem {
  id: number;
  name: string;
  createdAt: number;
}

export const dataSource: DataItem[] = [];

for (let i = 0; i < 300; i += 1) {
  dataSource.push({
    id: i,
    name: `TradeCode ${i}`,
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
  });
}

export async function getDataWithPagination(params: {
  pageNumber: number;
  pageSize: number;
}): Promise<RequestPagingData<DataItem>> {
  console.log(params);
  const { pageNumber, pageSize } = params;
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          items: dataSource.slice((pageNumber - 1) * pageSize, pageNumber * pageSize),
          totalRow: dataSource.length,
        },
        success: true,
      });
    }, 700);
  });
}

export async function getDataWithoutPagination(): Promise<RequestListData<DataItem>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: dataSource,
        success: true,
      });
    }, 700);
  });
}
