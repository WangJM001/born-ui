import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { usePrevious } from 'ahooks';
import type { RequestData } from '../../interface';
import useDebounceFn from '../../_utils/hooks/useDebounceFn';
import useDeepCompareEffect from '../../_utils/hooks/useDeepCompareEffect';

export interface UseFetchDataAction<T> {
  dataSource: T[];
  setDataSource: React.Dispatch<React.SetStateAction<T[]>>;
  loading: boolean | undefined;
  current: number;
  pageSize: number;
  totalRow: number;
  cancel: () => void;
  reload: () => Promise<void>;
  fullScreen?: () => void;
  resetPageIndex: () => void;
  reset: () => void;
  setPageInfo: (pageInfo: Partial<PageInfo>) => void;
}

interface PageInfo {
  pageNumber: number;
  pageSize: number;
  totalRow: number;
}

const useFetchData = <T>(
  getData: (params?: { pageSize: number; pageNumber: number }) => Promise<RequestData<T>>,
  options: {
    current?: number;
    pageSize?: number;
    defaultCurrent?: number;
    defaultPageSize?: number;
    formatData?: (data: T[]) => any[];
    effects?: any[];
    onLoadSuccess?: (dataSource: T[]) => void;
    pagination: boolean;
    onCancelEditing: () => void;
  },
): UseFetchDataAction<T> => {
  // 用于标定组件是否解除挂载，如果解除了就不要 setState
  const mountRef = useRef(true);
  const { pagination, onLoadSuccess = () => null, formatData, onCancelEditing } = options;

  const [dataSource, setDataSource] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean | undefined>(undefined);

  const [pageInfo, setPageInfo] = useState<PageInfo>({
    pageNumber: options?.current || options?.defaultCurrent || 1,
    totalRow: 0,
    pageSize: options?.pageSize || options?.defaultPageSize || 10,
  });

  // Batching update  https://github.com/facebook/react/issues/14259
  const setDataAndLoading = (newData: T[], dataTotal: number) => {
    ReactDOM.unstable_batchedUpdates(() => {
      setDataSource(newData);
      setLoading(false);
      setPageInfo({
        ...pageInfo,
        totalRow: dataTotal,
      });
    });
  };

  // pre state
  const prePageNumber = usePrevious(pageInfo.pageNumber);
  const prePageSize = usePrevious(pageInfo.pageSize);

  const { effects = [] } = options || {};

  /**
   * 请求数据
   */
  const fetchList = async () => {
    if (loading || !mountRef.current) {
      return;
    }

    onCancelEditing();

    setLoading(true);
    const { pageSize, pageNumber } = pageInfo;
    let items: T[] = [];
    let total;

    try {
      const { data, success } =
        (await getData(
          pagination !== false
            ? {
                pageNumber,
                pageSize,
              }
            : undefined,
        )) || {};

      if (success !== false) {
        if (Array.isArray(data)) {
          items = data;
          total = 0;
        } else {
          items = data.items;
          total = data.totalRow || 0;
        }
        if (formatData) {
          items = formatData(items);
        }
        setDataAndLoading(items, total);
      }
      if (onLoadSuccess) {
        onLoadSuccess(items);
      }
    } catch (e) {
      // 如果没有传递这个方法的话，需要把错误抛出去，以免吞掉错误
      throw new Error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchListDebounce = useDebounceFn(fetchList, [], 10);

  /**
   * pageIndex 改变的时候自动刷新
   */
  useEffect(() => {
    onCancelEditing();

    const { pageNumber, pageSize } = pageInfo;
    // 如果上次的页码为空或者两次页码等于是没必要查询的
    // 如果 pageSize 发生变化是需要查询的，所以又加了 prePageSize
    if (
      (!prePageNumber || prePageNumber === pageNumber) &&
      (!prePageSize || prePageSize === pageSize)
    ) {
      return () => undefined;
    }
    // 如果 list 的长度大于 pageSize 的长度
    // 说明是一个假分页
    // (pageIndex - 1 || 1) 至少要第一页
    // 在第一页大于 10
    // 第二页也应该是大于 10
    if (pageNumber !== undefined && dataSource.length <= pageSize) {
      fetchListDebounce.run();
      return () => fetchListDebounce.cancel();
    }
    return () => undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.pageNumber]);

  // pageSize 修改后返回第一页
  useEffect(() => {
    if (!prePageSize) {
      return () => undefined;
    }
    /**
     * 切换页面的时候清空一下数据，不然会造成判断失误。
     * 会认为是本地分页而不是服务器分页从而不请求数据
     */
    setDataSource([]);
    setPageInfo({ ...pageInfo, pageNumber: 1 });
    fetchListDebounce.run();
    return () => fetchListDebounce.cancel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.pageSize]);

  /**
   * 重置pageIndex 到 1
   */
  const resetPageIndex = () => {
    setPageInfo({ ...pageInfo, pageNumber: 1 });
  };

  useDeepCompareEffect(() => {
    mountRef.current = true;

    fetchListDebounce.run();
    return () => {
      fetchListDebounce.cancel();
      mountRef.current = false;
    };
  }, [...effects]);

  return {
    dataSource,
    setDataSource,
    loading,
    reload: async () => fetchListDebounce.run(),
    totalRow: pageInfo.totalRow,
    resetPageIndex,
    current: pageInfo.pageNumber,
    reset: () => {
      setPageInfo({
        pageNumber: options?.defaultCurrent || 1,
        totalRow: 0,
        pageSize: options?.defaultPageSize || 10,
      });
    },
    cancel: fetchListDebounce.cancel,
    pageSize: pageInfo.pageSize,
    setPageInfo: (info) => {
      setPageInfo({
        ...pageInfo,
        ...info,
      });
    },
  };
};

export default useFetchData;
