import React, {
  useEffect,
  CSSProperties,
  useRef,
  useState,
  ReactNode,
  useCallback,
  useContext,
} from 'react';
import { Table as ATable, Card, Space, Empty } from 'antd';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import classNames from 'classnames';
import { stringify } from 'use-json-comparison';
import {
  TablePaginationConfig,
  ColumnsType as AColumnsType,
  TableProps as ATableProps,
  ColumnType as AColumnType,
} from 'antd/lib/table';
import {
  ColumnFilterItem,
  TableCurrentDataSource,
  SorterResult,
  TableRowSelection as ATableRowSelection,
} from 'antd/lib/table/interface';
import Form, { Rule } from 'antd/lib/form';
import omit from 'lodash/omit';
import { CLASS_NAME_PREFIX } from '../constants';
import useDeepCompareEffect from '../_utils/hooks/useDeepCompareEffect';
import checkUndefinedOrNull from '../_utils/checkUndefinedOrNull';
import useFetchData, { UseFetchDataAction } from './hooks/useFetchData';
import Container, { useCounter } from './container';
import Toolbar, { OptionConfig, ToolbarProps } from './Toolbar';
import Alert from './Alert';
import { genColumnKey, getRowKey } from './utils';
import defaultRenderText, { ColumnsDataType } from './defaultRender';
import { RequestData } from '../interface';
import omitEmpty from '../_utils/omitEmpty';
import defaultColumnsFilter from './defaultFilter';
import { ConfigContext } from '../config-provider';
import { FormatSymbolType } from '../config-provider/context';
import defaultColumnsSorter from './defaultSorter';
import EditableCell from './EditableCell';

export type SortType = {
  [key: string]: 'asc' | 'desc';
};

export type FilterType = {
  [key: string]: React.ReactText[];
};

export interface ActionType<T> {
  reload: (resetPageIndex?: boolean) => void;
  clearSelected: () => void;
  edit: (record: T) => void;
}

export interface ColumnsState {
  show?: boolean;
  fixed?: 'right' | 'left' | undefined;
}

export type ColumnsEditorFunction<T> = (item: T) => React.ReactNode;

export interface ColumnType<T = unknown>
  extends Omit<AColumnType<T>, 'dataIndex' | 'render' | 'children' | 'title' | 'filters'> {
  dataIndex: string | string[];
  index?: number;
  title?: ReactNode | ((config: ColumnType<T>) => ReactNode);
  /**
   * 自定义 render
   */
  render?: (
    text: React.ReactNode,
    record: T,
    index: number,
    action: UseFetchDataAction<RequestData<T>>,
  ) => React.ReactNode | React.ReactNode[];

  /**
   * 值的类型
   */
  dataType?: ColumnsDataType<T>;

  /**
   * 在 table 中隐藏
   */
  hideInTable?: boolean;

  /**
   * 表头的筛选菜单项
   */
  filters?: boolean | ColumnFilterItem[];

  /**
   * 行编辑
   */
  editor?: boolean | React.ReactNode | ColumnsEditorFunction<T>;
  /**
   * 行编辑时form name属性，为空则取dataIndex
   */
  editorName?: string | string[];
  rules?: Rule[];
}

export interface ColumnGroupType<T> extends ColumnType<T> {
  children: ColumnsType<T>;
}

export type ColumnsType<T = {}> = (ColumnGroupType<T> | ColumnType<T>)[];

export interface TableRowSelection<T> extends ATableRowSelection<T> {
  /**
   * 自定义 table 的 alert
   * 设置或者返回false 即可关闭
   */
  alertRender?:
    | ((props: { selectedRowKeys: (string | number)[]; selectedRows: T[] }) => React.ReactNode)
    | false;

  /**
   * 自定义 table 的 alert 的操作
   * 设置或者返回false 即可关闭
   */
  alertOptionRender?: ((props: { onCleanSelected: () => void }) => React.ReactNode) | false;
}

export interface TableProps<T, U extends { [key: string]: any }>
  extends Omit<ATableProps<T>, 'columns' | 'rowSelection'> {
  columns?: ColumnsType<T>;

  params?: U;

  columnsStateMap?: {
    [key: string]: ColumnsState;
  };

  onColumnsStateChange?: (map: { [key: string]: ColumnsState }) => void;

  /**
   * 一个获得 dataSource 的方法
   */
  request?: (
    params: U & {
      pageSize?: number;
      pageNumber?: number;
    },
    sort: SortType,
    filter: FilterType,
  ) => Promise<RequestData<T>>;

  /**
   * 对数据进行一些处理
   */
  postData?: (data: T[]) => any[];

  /**
   * 初始化的参数，可以操作 table
   */
  actionRef?:
    | React.MutableRefObject<ActionType<T> | undefined>
    | ((actionRef: ActionType<T>) => void);

  /**
   * 渲染操作栏
   */
  toolbar?: ToolbarProps<T>['toolbar'] | false;

  /**
   * 数据加载完成后触发
   */
  onLoad?: (dataSource: T[]) => void;

  className?: string;

  style?: CSSProperties;

  /**
   * 左上角的 title
   */
  headerTitle?: React.ReactNode;

  /**
   * 默认的操作栏配置
   */
  options?: OptionConfig<T> | false;

  rowSelection?: TableRowSelection<T> | false;

  /**
   * 空值时显示
   */
  columnEmptyText?: ColumnEmptyText;

  /**
   * 行编辑后点击保存触发
   */
  onEditSave?: (formValue: T, originalRecord: T, index: number) => Promise<any>;

  /**
   * card body padding样式
   */
  padding?: boolean;

  useUrlState?: boolean;
}

const mergePagination = <T extends any, U>(
  pagination: TablePaginationConfig | boolean | undefined = {},
  action: UseFetchDataAction<T>,
  defaultPageSize: number,
): TablePaginationConfig | false | undefined => {
  if (pagination === false) {
    return {};
  }
  let defaultPagination: TablePaginationConfig | {} = pagination || {};
  const { current, pageSize } = action;
  if (pagination === true) {
    defaultPagination = {};
  }
  return {
    showSizeChanger: true,
    total: action.totalRow,
    ...(defaultPagination as TablePaginationConfig),
    current,
    pageSize,
    onChange: (pageNumber: number, newPageSize?: number) => {
      // pageSize 改变之后就没必要切换页码
      if (newPageSize !== pageSize && current !== pageNumber) {
        action.setPageInfo({ pageSize: newPageSize, pageNumber });
      } else {
        if (newPageSize !== pageSize) {
          action.setPageInfo({ pageSize: newPageSize });
        }
        if (current !== pageNumber) {
          action.setPageInfo({ pageNumber });
        }
      }

      const { onChange } = pagination as TablePaginationConfig;
      if (onChange) {
        onChange(pageNumber, newPageSize || defaultPageSize);
      }
    },
  };
};

export type ColumnEmptyText = string | false;

interface ColumnRenderInterface<T> {
  item: ColumnType<T>;
  text: any;
  row: T;
  index: number;
  columnEmptyText?: ColumnEmptyText;
  counter: ReturnType<typeof useCounter>;
  formatSymbol: FormatSymbolType;
}

/**
 * 这个组件负责单元格的具体渲染
 * @param param0
 */
const columnRender = <T, U = any>({
  item,
  text,
  row,
  index,
  columnEmptyText,
  counter,
  formatSymbol,
}: ColumnRenderInterface<T>): any => {
  const { action } = counter;
  if (!action.current) {
    return null;
  }

  const dom = defaultRenderText<T>(
    text,
    item.dataType || 'text',
    index,
    formatSymbol,
    row,
    columnEmptyText,
  );

  if (item.render) {
    const renderDom = item.render(dom, row, index, action.current);

    // 如果是合并单元格的，直接返回对象
    if (
      renderDom &&
      typeof renderDom === 'object' &&
      (renderDom as { props: { colSpan: number } }).props &&
      (renderDom as { props: { colSpan: number } }).props.colSpan
    ) {
      return renderDom;
    }

    if (renderDom && item.dataType === 'option' && Array.isArray(renderDom)) {
      return <Space>{renderDom}</Space>;
    }
    return renderDom as React.ReactNode;
  }
  return checkUndefinedOrNull(dom) ? dom : null;
};

/**
 * 转化 columns 格式
 * 主要是 render 方法的自行实现
 * @param columns
 * @param map
 * @param columnEmptyText
 */
const genColumnList = <T, U = {}>(
  columns: ColumnsType<T>,
  map: {
    [key: string]: ColumnsState;
  },
  counter: ReturnType<typeof useCounter>,
  formatSymbol: FormatSymbolType,
  columnEmptyText?: ColumnEmptyText,
): (AColumnsType<T>[number] & { index?: number })[] => {
  const editable = columns.some((column) => column.editor);
  counter.setEditable(editable);

  return (columns
    .map((item, columnsIndex) => {
      const { key, dataIndex, title, filters, dataType, sorter, editor, rules, editorName } = item;
      const columnKey = genColumnKey(key, dataIndex, columnsIndex);
      if (!dataIndex && !dataType) {
        return item;
      }

      const config = columnKey ? map[columnKey] || { fixed: item.fixed } : { fixed: item.fixed };
      const { propsRef } = counter;
      const tempColumn = {
        index: columnsIndex,
        ...omit(item, ['editor', 'rules', 'editorName', 'datatype']),
        ...(filters === true
          ? defaultColumnsFilter(dataIndex, dataType, !!propsRef.current?.request)
          : { filters }),
        sorter:
          sorter === true && !propsRef.current?.request
            ? defaultColumnsSorter<T>(dataIndex, dataType)
            : sorter,
        title: title && typeof title === 'function' ? title(item) : title,
        fixed: config.fixed,
        width: item.width || (item.fixed ? 200 : undefined),
        children: (item as ColumnGroupType<T>).children
          ? genColumnList(
              (item as ColumnGroupType<T>).children as ColumnsType<T>,
              map,
              counter,
              formatSymbol,
              columnEmptyText,
            )
          : undefined,
        render: (text: any, row: T, index: number) =>
          columnRender<T>({
            item,
            text,
            row,
            index,
            columnEmptyText,
            counter,
            formatSymbol,
          }),
      };
      if (!tempColumn.children || !tempColumn.children.length) {
        delete tempColumn.children;
      }

      if (editable) {
        tempColumn.onCell = (record: T, index?: number) =>
          ({
            index,
            title,
            dataIndex,
            dataType,
            record,
            editor,
            editorName,
            rules,
          } as any);
      }

      return tempColumn;
    })
    .filter((item: any) => !item.hideInTable) as unknown) as AColumnType<T>[];
};

/**
 * 重新封装Table
 * @param props
 */
const Table = <T extends Record<string, any>, U extends object>(props: TableProps<T, U>) => {
  const {
    request,
    className,
    params = {},
    headerTitle,
    postData,
    pagination: propsPagination,
    actionRef,
    columns: propsColumns = [],
    toolbar,
    onLoad,
    style,
    columnsStateMap,
    onColumnsStateChange,
    options = false,
    rowSelection: propsRowSelection = false,
    columnEmptyText = '-',
    rowKey = 'id',
    padding = true,
    useUrlState,
    ...rest
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useMergedState<React.ReactText[]>([], {
    value: propsRowSelection ? propsRowSelection.selectedRowKeys : undefined,
  });
  const [selectedRows, setSelectedRows] = useMergedState<T[]>([]);

  const setSelectedRowsAndKey = (keys: React.ReactText[], rows: T[]) => {
    setSelectedRowKeys(keys);
    setSelectedRows(rows);
  };

  const [search, setSearch] = useState<{}>();
  const [filter, setFilter] = useState<FilterType>({});
  const [sort, setSort] = useState<SortType>({});

  /**
   * 获取 table 的 dom ref
   */
  const rootRef = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<() => void>();

  const { tablePageSize: defaultTablePageSize, formatSymbol } = useContext(ConfigContext);

  /**
   * 需要初始化 不然默认可能报错
   * 这里取了 defaultCurrent 和 current
   * 为了保证不会重复刷新
   */
  const fetchPagination =
    typeof propsPagination === 'object'
      ? (propsPagination as TablePaginationConfig)
      : {
          defaultCurrent: 1,
          defaultPageSize: defaultTablePageSize,
          pageSize: defaultTablePageSize,
          current: 1,
        };

  const action = useFetchData(
    async (pageParams) => {
      if (!request) {
        return {
          data: props.dataSource || [],
          success: true,
        } as RequestData<T>;
      }

      const actionParams = {
        ...(pageParams || {}),
        ...search,
        ...params,
      };

      // eslint-disable-next-line no-underscore-dangle
      delete (actionParams as any)._timestamp;
      return request((actionParams as unknown) as U, sort, filter);
    },
    {
      ...fetchPagination,
      pagination: propsPagination !== false,
      onLoad,
      postData,
      useUrlState,
      effects: [stringify(params), stringify(search), stringify(filter), stringify(sort)],
    },
  );

  useEffect(() => {
    fullScreen.current = () => {
      if (!rootRef.current || !document.fullscreenEnabled) {
        return;
      }
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        rootRef.current.requestFullscreen();
      }
    };
  }, [rootRef.current]);

  action.fullScreen = fullScreen.current;

  const pagination =
    propsPagination !== false &&
    mergePagination<T, {}>(propsPagination, action, defaultTablePageSize);

  const counter = Container.useContainer();

  const onCleanSelected = useCallback(() => {
    if (propsRowSelection && propsRowSelection.onChange) {
      propsRowSelection.onChange([], []);
    }
    setSelectedRowsAndKey([], []);
  }, [setSelectedRowKeys]);

  const onCancelEditing = useCallback(() => {
    counter.setEditingKey(undefined);
  }, []);

  counter.setAction(action);
  counter.propsRef.current = props;

  /**
   * 这里生成action的映射，保证 action 总是使用的最新
   * 只需要渲染一次即可
   */
  useEffect(() => {
    const userAction: ActionType<T> = {
      reload: async (resetPageIndex?: boolean) => {
        const {
          action: { current },
        } = counter;
        if (!current) {
          return;
        }

        onCleanSelected();
        onCancelEditing();

        // 如果为 true，回到第一页
        if (resetPageIndex) {
          await current.resetPageIndex();
        }
        await current.reload();
      },
      clearSelected: () => onCleanSelected(),
      edit: (record: T) => {
        if (!counter.editable) {
          return;
        }
        onCleanSelected();
        // edit form 设值
        counter.editFormRef?.current?.setFieldsValue(record);
        counter.setEditingKey(getRowKey(record, rowKey));
      },
    };
    if (actionRef && typeof actionRef === 'function') {
      actionRef(userAction);
    }
    if (actionRef && typeof actionRef !== 'function') {
      actionRef.current = userAction;
    }
  }, [counter.editable]);

  /**
   * Table Column 变化的时候更新一下，这个参数将会用于渲染
   */
  useDeepCompareEffect(() => {
    const tableColumn = genColumnList<T>(
      propsColumns,
      counter.columnsMap,
      counter,
      formatSymbol,
      columnEmptyText,
    );
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
      // 重新生成key的字符串用于排序
      counter.setSortKeyColumns(
        tableColumn.map((item, index) => {
          const key = genColumnKey(item.key, (item as ColumnType).dataIndex, index) || `${index}`;
          return `${key}_${index}`;
        }),
      );
    }
  }, [propsColumns]);

  /**
   * 这里主要是为了排序，为了保证更新及时，每次都重新计算
   */
  useDeepCompareEffect(() => {
    const keys = counter.sortKeyColumns.join(',');
    let tableColumn = genColumnList<T>(
      propsColumns,
      counter.columnsMap,
      counter,
      formatSymbol,
      columnEmptyText,
    );
    if (keys.length > 0) {
      // 用于可视化的排序
      tableColumn = tableColumn.sort((a, b) => {
        const { fixed: aFixed, index: aIndex } = a;
        const { fixed: bFixed, index: bIndex } = b;
        if (
          (aFixed === 'left' && bFixed !== 'left') ||
          (bFixed === 'right' && aFixed !== 'right')
        ) {
          return -2;
        }
        if (
          (bFixed === 'left' && aFixed !== 'left') ||
          (aFixed === 'right' && bFixed !== 'right')
        ) {
          return 2;
        }
        // 如果没有index，在 dataIndex 或者 key 不存在的时候他会报错
        const aKey = `${genColumnKey(a.key, (a as ColumnType).dataIndex, aIndex)}_${aIndex}`;
        const bKey = `${genColumnKey(b.key, (b as ColumnType).dataIndex, bIndex)}_${bIndex}`;
        return keys.indexOf(aKey) - keys.indexOf(bKey);
      });
    }
    if (tableColumn && tableColumn.length > 0) {
      counter.setColumns(tableColumn);
    }
  }, [counter.columnsMap, counter.sortKeyColumns.join('-')]);

  /**
   * 同步 Pagination，支持受控的 页码 和 pageSize
   */
  useDeepCompareEffect(() => {
    if (propsPagination && propsPagination.current && propsPagination.pageSize) {
      action.setPageInfo({
        pageSize: propsPagination.pageSize,
        pageNumber: propsPagination.current,
      });
    }
  }, [propsPagination]);

  const rowSelection: TableRowSelection<T> = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    ...propsRowSelection,
    onChange: (keys, rows) => {
      if (propsRowSelection && propsRowSelection.onChange) {
        propsRowSelection.onChange(keys, rows);
      }
      setSelectedRowsAndKey(keys, rows);
    },
  };

  if (counter.columns.length < 1) {
    return (
      <Card bordered={false} bodyStyle={{ padding: 50 }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </Card>
    );
  }

  const alertDom = propsRowSelection !== false &&
    selectedRowKeys.length > 0 &&
    propsRowSelection.alertRender !== false && (
      <Alert<T>
        selectedRowKeys={selectedRowKeys}
        selectedRows={selectedRows}
        onCleanSelected={onCleanSelected}
        alertOptionRender={propsRowSelection.alertOptionRender}
        alertInfoRender={propsRowSelection.alertRender}
      />
    );

  const toolbarDom = toolbar !== false &&
    (options !== false || headerTitle || toolbar) &&
    !alertDom && (
      <Toolbar<T>
        options={options}
        headerTitle={headerTitle}
        action={action}
        onSearch={(keyword) => {
          if (options && options.search) {
            const { name = 'keyword' } =
              options.search === true
                ? {
                    name: 'keyword',
                  }
                : options.search;
            setSearch({
              [name]: keyword,
            });
          }
        }}
        selectedRows={selectedRows}
        selectedRowKeys={selectedRowKeys}
        toolbar={toolbar}
      />
    );

  const editableProps = {
    components: {
      body: {
        cell: EditableCell,
      },
    },
  };
  const tableDom = (
    <ATable<T>
      {...rest}
      {...(counter.editable && editableProps)}
      rowKey={rowKey}
      rowSelection={propsRowSelection === false ? undefined : rowSelection}
      columns={counter.columns.filter((item) => {
        // 删掉不应该显示的
        const { key, dataIndex } = item;
        const columnKey = genColumnKey(key, dataIndex);
        if (!columnKey) {
          return true;
        }
        const config = counter.columnsMap[columnKey];
        if (config && config.show === false) {
          return false;
        }
        return true;
      })}
      loading={action.loading || props.loading}
      dataSource={action.dataSource}
      pagination={pagination}
      onChange={(
        changePagination: TablePaginationConfig,
        filters: {
          [string: string]: React.ReactText[] | null;
        },
        sorter: SorterResult<T> | SorterResult<T>[],
        extra: TableCurrentDataSource<T>,
      ) => {
        if (rest.onChange) {
          rest.onChange(changePagination, filters, sorter, extra);
        }

        onCancelEditing();

        // 制造筛选的数据
        setFilter(
          Object.keys(filters).reduce((prev, key) => {
            const value = filters[key];
            if (!value || value.length === 0) {
              return prev;
            }

            return {
              ...prev,
              [key]: value[0],
            };
          }, {}),
        );

        // 制造一个排序的数据
        if (Array.isArray(sorter)) {
          const data = sorter.reduce<{
            [key: string]: any;
          }>((pre, value) => {
            if (!value.order) {
              return pre;
            }
            return {
              ...pre,
              [`${value.field}`]: value.order === 'ascend' ? 'asc' : 'desc',
            };
          }, {});
          setSort(omitEmpty(data));
        } else if (sorter.order) {
          setSort(
            omitEmpty({
              [`${sorter.field}`]: sorter.order === 'ascend' ? 'asc' : 'desc',
            }),
          );
        } else {
          setSort({});
        }
      }}
    />
  );

  return (
    <div
      className={classNames(`${CLASS_NAME_PREFIX}-table`, { [`${className}`]: className })}
      style={style}
      ref={rootRef}
    >
      <Card
        bordered={false}
        style={{
          height: '100%',
        }}
        bodyStyle={{
          padding: padding ? 24 : 0,
        }}
      >
        {toolbarDom}
        {alertDom}
        {counter.editable ? (
          <Form ref={counter.editFormRef} component={false}>
            {tableDom}
          </Form>
        ) : (
          tableDom
        )}
      </Card>
    </div>
  );
};

const ProviderWarp = <T, U extends { [key: string]: any } = {}>(props: TableProps<T, U>) => (
  <Container.Provider initialState={props}>
    <Table {...props} />
  </Container.Provider>
);

export default ProviderWarp;
