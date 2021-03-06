import useUrlState from '@ahooksjs/use-url-state';
import { useCreation } from 'ahooks';
import { Card, Empty, Space, Table as ATable } from 'antd';
import type { Rule } from 'antd/lib/form';
import Form from 'antd/lib/form';
import type {
  ColumnType as AColumnType,
  TablePaginationConfig,
  TableProps as ATableProps,
} from 'antd/lib/table';
import type {
  ColumnFilterItem,
  SorterResult,
  TableCurrentDataSource,
  TableRowSelection as ATableRowSelection,
} from 'antd/lib/table/interface';
import classNames from 'classnames';
import { set } from 'lodash';
import omit from 'lodash/omit';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import type { CSSProperties, Key, ReactNode } from 'react';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { stringify } from 'use-json-comparison';
import { ConfigContext } from '../config-provider';
import type { FormatSymbolType } from '../config-provider/context';
import { CLASS_NAME_PREFIX } from '../constants';
import type { RequestData } from '../interface';
import checkUndefinedOrNull from '../_utils/checkUndefinedOrNull';
import useDeepCompareEffect from '../_utils/hooks/useDeepCompareEffect';
import omitEmpty from '../_utils/omitEmpty';
import Alert from './Alert';
import type { useCounter } from './container';
import Container from './container';
import defaultColumnsFilter from './defaultFilter';
import type { ColumnsDataType } from './defaultRender';
import defaultRenderText from './defaultRender';
import defaultColumnsSorter from './defaultSorter';
import EditableCell from './EditableCell';
import type { UseFetchDataAction } from './hooks/useFetchData';
import useFetchData from './hooks/useFetchData';
import type { SearchFormProps } from './SearchForm';
import SearchForm from './SearchForm';
import type { OptionConfig, ToolbarProps } from './Toolbar';
import Toolbar from './Toolbar';
import { genColumnKey, genDataIndexStr, getRowKey, transformSortOrder } from './utils';

export type SorterType = Record<string, 'asc' | 'desc'>;

export type FilterType = Record<string, any>;

export interface UrlStateType {
  pageNumber?: string;
  pageSize?: string;
  search?: string;
  filter?: string;
  sorter?: string;
  searchForm?: string;
}

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
  /** Link to */
  link?: (record: T) => string;
  /**
   * ????????? render
   */
  render?: (
    value: any,
    record: T,
    index: number,
    action: UseFetchDataAction<RequestData<T>>,
  ) => React.ReactNode | React.ReactNode[];

  /**
   * ????????????
   */
  dataType?: ColumnsDataType<T>;

  /**
   * ??? table ?????????
   */
  hideInTable?: boolean;

  /**
   * ????????????????????????
   */
  filters?: boolean | ColumnFilterItem[];

  /**
   * ?????????
   */
  editor?: boolean | React.ReactNode | ColumnsEditorFunction<T>;
  /**
   * ????????????form name?????????????????????dataIndex
   */
  editorName?: string | string[];
  rules?: Rule[];
}

export interface ColumnGroupType<T> extends ColumnType<T> {
  children: ColumnsType<T>;
}

export type ColumnsType<T extends Record<string, any>> = (ColumnGroupType<T> | ColumnType<T>)[];

export interface TableRowSelection<T> extends ATableRowSelection<T> {
  /**
   * ????????? table ??? alert
   * ??????????????????false ????????????
   */
  alertRender?:
    | ((props: { selectedRowKeys: (string | number)[]; selectedRows: T[] }) => React.ReactNode)
    | false;

  /**
   * ????????? table ??? alert ?????????
   * ??????????????????false ????????????
   */
  alertOptionRender?:
    | ((props: {
        onCleanSelected: () => void;
        selectedRowKeys: (string | number)[];
        selectedRows: T[];
      }) => React.ReactNode)
    | false;
}

export interface TableProps<T, U extends Record<string, any>>
  extends Omit<ATableProps<T>, 'columns' | 'rowSelection'> {
  columns?: ColumnsType<T>;

  params?: U;

  columnsStateMap?: Record<string, ColumnsState>;

  onColumnsStateChange?: (map: Record<string, ColumnsState>) => void;

  /**
   * ???????????? dataSource ?????????
   */
  request?: (
    params: U & {
      pageSize?: number;
      pageNumber?: number;
    },
    sort?: SorterType,
    filter?: FilterType,
  ) => Promise<RequestData<T>>;

  /**
   * ???????????????????????????
   */
  formatData?: (data: T[]) => any[];

  /**
   * ????????????????????????????????? table
   */
  actionRef?:
    | React.MutableRefObject<ActionType<T> | undefined>
    | ((actionRef: ActionType<T>) => void);

  /**
   * ???????????????
   */
  toolbar?: ToolbarProps<T>['toolbar'] | false;

  /**
   * ???????????????????????????
   */
  onLoadSuccess?: (dataSource: T[]) => void;

  className?: string;

  style?: CSSProperties;

  /**
   * ???????????? title
   */
  headerTitle?: React.ReactNode;

  /**
   * ????????????????????????
   */
  options?: OptionConfig | false;

  rowSelection?: TableRowSelection<T> | false;

  /**
   * ??????????????????????????????
   */
  onEditSave?: (formValue: T, originalRecord: T, index: number) => Promise<any>;

  /**
   * card body padding??????
   */
  padding?: boolean;
  /**
   * ?????????????????? url query ???
   */
  urlState?: boolean;
  /**
   * ????????????
   */
  searchForm?: Omit<SearchFormProps, 'onSearch' | 'values'>;
  /**
   * searchForm???table??????????????????
   * params = propsParams + searchForm
   */
  extraRender?: (params: U & Record<string, any>) => ReactNode;
}

const mergePagination = <T extends any>(
  pagination: TablePaginationConfig | boolean | undefined = {},
  action: UseFetchDataAction<T>,
): TablePaginationConfig | false | undefined => {
  if (pagination === false) {
    return {};
  }
  let defaultPagination: TablePaginationConfig | typeof pagination = pagination || {};
  const { current, pageSize, totalRow } = action;
  if (pagination === true) {
    defaultPagination = {};
  }
  return {
    showSizeChanger: true,
    total: totalRow,
    ...(defaultPagination as TablePaginationConfig),
    current,
    pageSize,
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
 * ??????????????????????????????????????????
 * @param param0
 */
const columnRender = <T,>({
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

  if (item.render) {
    const renderDom = item.render(text, row, index, action.current);

    // ????????????????????????????????????????????????
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

  const dom = defaultRenderText<T>(
    text,
    item.dataType || 'text',
    index,
    formatSymbol,
    row,
    columnEmptyText,
    item.link,
  );

  return checkUndefinedOrNull(dom) ? dom : null;
};

/**
 * ?????????????????????????????????????????????
 * @param dataType
 */
const columnAlgin = <T,>(dataType: ColumnType<T>['dataType']): ColumnType<T>['align'] =>
  dataType === 'currency' || dataType === 'number' || dataType === 'percent' ? 'right' : 'left';

/**
 * ?????? columns ??????
 * ????????? render ?????????????????????
 * @param columns
 * @param map
 * @param columnEmptyText
 */
const genColumnList = <T,>(
  columns: ColumnsType<T>,
  map: Record<string, ColumnsState>,
  counter: ReturnType<typeof useCounter>,
  urlState: UrlStateType,
  formatSymbol: FormatSymbolType,
  columnEmptyText?: ColumnEmptyText,
): ColumnsType<T> => {
  const urlFilter = urlState.filter ? JSON.parse(urlState.filter) : {};
  const urlSorter = urlState.sorter ? JSON.parse(urlState.sorter) : {};

  return (columns
    .map((item, columnsIndex) => {
      const { key, dataIndex, title, filters, dataType, sorter, editor, rules, editorName } = item;
      const columnKey = genColumnKey(key, dataIndex, columnsIndex);
      if (!dataIndex && !dataType) {
        return item;
      }

      const config = columnKey ? map[columnKey] || { fixed: item.fixed } : { fixed: item.fixed };
      const dataIndexStr = genDataIndexStr(dataIndex);
      const filteredValue = urlFilter[dataIndexStr];
      const isEnumFilter = typeof dataType === 'object' && dataType.type === 'enum';
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
        ...(propsRef.current?.urlState && {
          filteredValue: !isEnumFilter && filteredValue ? [filteredValue] : filteredValue,
          sortOrder: transformSortOrder(urlSorter[dataIndexStr]),
        }),
        title: title && typeof title === 'function' ? title(item) : title,
        fixed: config.fixed,
        width: item.width || (item.fixed ? 200 : undefined),
        children: (item as ColumnGroupType<T>).children
          ? genColumnList(
              (item as ColumnGroupType<T>).children as ColumnsType<T>,
              map,
              counter,
              urlState,
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
        align: item.align || columnAlgin(dataType),
      };

      if (!tempColumn.children || !tempColumn.children.length) {
        delete tempColumn.children;
      }

      if (counter.editable) {
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
    .filter((item: any) => !item.hideInTable) as unknown) as ColumnsType<T>;
};

/**
 * ????????????Table
 * @param props
 */
const Table = <T extends Record<string, any>, U extends Record<string, any>>(
  props: TableProps<T, U>,
) => {
  const {
    request,
    className,
    params = {},
    headerTitle,
    formatData,
    pagination: propsPagination,
    actionRef,
    columns: propsColumns = [],
    toolbar,
    onLoadSuccess,
    style,
    columnsStateMap,
    onColumnsStateChange,
    options = false,
    rowSelection: propsRowSelection = false,
    rowKey = 'id',
    padding = true,
    urlState: isUrlState,
    searchForm,
    extraRender,
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

  let searchName = 'keyword';
  if (options && options.search && !(options.search === true)) {
    searchName = options.search.name || 'keyword';
  }
  const [search, setSearch] = useState<Record<string, any>>();
  const [filter, setFilter] = useState<FilterType>();
  const [sorter, setSorter] = useState<SorterType>();
  const [searchFormParams, setSearchFormParams] = useState<Record<string, any>>(() => {
    const initialValues = searchForm?.initialValues || {};

    if (searchForm?.items && searchForm.items.length) {
      searchForm.items.forEach((category) => {
        category.forEach((item) => {
          if (item.name && item.initialValue !== undefined && item.initialValue !== null)
            set(initialValues, item.name, item.initialValue);
        });
      });
    }

    return initialValues;
  });

  const { tablePageSize: defaultTablePageSize, formatSymbol, emptyText } = useContext(
    ConfigContext,
  );

  const defaultUrlState = {
    pageNumber: '1',
    pageSize: `${defaultTablePageSize}`,
    search: undefined,
    filter: '{}',
    sorter: '{}',
    searchForm: stringify(searchFormParams),
  };
  const [urlState, setUrlState] = useUrlState<UrlStateType>(defaultUrlState, {
    navigateMode: 'replace',
  });
  const urlStateDeps = Object.keys(omit(defaultUrlState, ['search', 'searchForm'])).map(
    (state) => urlState[state],
  );

  /**
   * ?????? table ??? dom ref
   */
  const rootRef = useRef<HTMLDivElement>(null);
  const fullScreen = useRef<() => void>();

  /**
   * ??????????????? ????????????????????????
   * ???????????? defaultCurrent ??? current
   * ??????????????????????????????
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

  const counter = Container.useContainer();

  const onCancelEditing = useCallback(() => {
    if (counter.editable) {
      counter.setEditingKey(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter.editable]);

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
        ...params,
        ...search,
        ...searchFormParams,
      };

      // eslint-disable-next-line no-underscore-dangle
      delete (actionParams as any)._timestamp;
      return request((actionParams as unknown) as U, sorter, filter);
    },
    {
      ...fetchPagination,
      pagination: propsPagination !== false,
      onLoadSuccess,
      formatData,
      onCancelEditing,
      effects: [
        stringify(params),
        stringify(search),
        stringify(filter),
        stringify(sorter),
        stringify(searchFormParams),
      ],
    },
  );

  /**
   * ????????????????????????????????????
   */
  useEffect(() => {
    if (propsPagination) {
      if (isUrlState) {
        setUrlState({ pageNumber: 1 });
      } else {
        action.resetPageIndex();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringify(params)]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef.current]);

  action.fullScreen = fullScreen.current;

  const pagination = propsPagination !== false && mergePagination<T>(propsPagination, action);

  const onCleanSelected = () => {
    if (propsRowSelection && propsRowSelection.onChange) {
      propsRowSelection.onChange([], []);
    }
    setSelectedRowsAndKey([], []);
  };

  counter.setAction(action);
  counter.propsRef.current = props;

  /**
   * ??????url state?????????state
   * page:string
   * pageSize:string
   * search:string
   * filter: {[dataIndex]:string}
   * sort: {[dataIndex]:'asc'|'desc'}
   */
  useEffect(() => {
    if (isUrlState) {
      action.setPageInfo({
        pageNumber: Number(urlState.pageNumber),
        pageSize: Number(urlState.pageSize),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUrlState, urlState.pageNumber, urlState.pageSize]);
  useEffect(() => {
    if (isUrlState) {
      setSearch({ [searchName]: urlState.search });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUrlState, urlState.search]);
  useEffect(() => {
    if (isUrlState) {
      setFilter(JSON.parse(urlState.filter));
    }
  }, [isUrlState, urlState.filter]);
  useEffect(() => {
    if (isUrlState) {
      setSorter(JSON.parse(urlState.sorter));
    }
  }, [isUrlState, urlState.sorter]);
  useEffect(() => {
    if (isUrlState) {
      setSearchFormParams(JSON.parse(urlState.searchForm));
    }
  }, [isUrlState, urlState.searchForm]);

  /**
   * ????????????action?????????????????? action ?????????????????????
   * ???????????????????????????
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

        // ????????? true??????????????????
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
        // edit form ??????
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [counter.editable]);

  useDeepCompareEffect(() => {
    counter.setEditable(propsColumns.some((column) => column.editor));
  }, [propsColumns]);

  const tableColumns = useMemo(
    () =>
      genColumnList<T>(
        propsColumns,
        counter.columnsMap,
        counter,
        urlState,
        formatSymbol,
        emptyText,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propsColumns, ...urlStateDeps],
  );

  /**
   * ???????????????
   * ?????????????????????
   */
  const enumsColumnsDataIndex: string[] = useMemo(
    () =>
      propsColumns
        .map(({ dataType, dataIndex }) =>
          typeof dataType === 'object' && dataType.type === 'enum'
            ? genDataIndexStr(dataIndex)
            : '',
        )
        .filter(Boolean),
    [propsColumns],
  );

  /**
   * Table Column ????????????????????????????????????????????????????????????
   */
  useDeepCompareEffect(() => {
    if (tableColumns && tableColumns.length > 0) {
      counter.setColumns(tableColumns);
      // ????????????key????????????????????????
      counter.setSortKeyColumns(
        tableColumns.map((item, index) => {
          const key = genColumnKey(item.key, (item as ColumnType).dataIndex, index) || `${index}`;
          return `${key}_${index}`;
        }),
      );
    }
  }, [tableColumns]);

  /**
   * ??????????????????????????????????????????????????????????????????????????????
   */
  useDeepCompareEffect(() => {
    const keys = counter.sortKeyColumns.join(',');
    let sortTableColumn = genColumnList<T>(
      propsColumns,
      counter.columnsMap,
      counter,
      urlState,
      formatSymbol,
      emptyText,
    );
    if (keys.length > 0) {
      // ????????????????????????
      sortTableColumn = sortTableColumn.sort((a, b) => {
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
        // ????????????index?????? dataIndex ?????? key ??????????????????????????????
        const aKey = `${genColumnKey(a.key, (a as ColumnType).dataIndex, aIndex)}_${aIndex}`;
        const bKey = `${genColumnKey(b.key, (b as ColumnType).dataIndex, bIndex)}_${bIndex}`;
        return keys.indexOf(aKey) - keys.indexOf(bKey);
      });
    }
    if (sortTableColumn && sortTableColumn.length > 0) {
      counter.setColumns(sortTableColumn);
    }
  }, [counter.columnsMap, counter.sortKeyColumns.join('-')]);

  /**
   * ?????? Pagination?????????????????? ?????? ??? pageSize
   */
  useDeepCompareEffect(() => {
    if (propsPagination && propsPagination.current && propsPagination.pageSize) {
      action.setPageInfo({
        pageSize: propsPagination.pageSize,
        pageNumber: propsPagination.current,
      });
    }
  }, [propsPagination]);

  const extraRenderParams = useCreation(
    () => ({
      ...params,
      ...searchFormParams,
    }),
    [stringify(params), stringify(searchFormParams), stringify(searchForm?.initialValues)],
  );

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

  const onTableChange = (
    changePagination: TablePaginationConfig,
    changeFilters: Record<string, (Key | boolean)[] | null>,
    changeSorter: SorterResult<T> | SorterResult<T>[],
    extra: TableCurrentDataSource<T>,
  ) => {
    if (rest.onChange) {
      rest.onChange(changePagination, changeFilters, changeSorter, extra);
    }

    switch (extra.action) {
      case 'paginate': {
        const { current, pageSize } = changePagination;
        if (isUrlState) {
          const paginate: { pageNumber?: number; pageSize?: number } = { pageNumber: current };
          if (action.pageSize !== pageSize) {
            paginate.pageSize = pageSize;
          }
          setUrlState(paginate);
        } else {
          action.setPageInfo({
            pageNumber: current,
            pageSize,
          });
        }
        break;
      }
      case 'filter': {
        const filterValue = Object.keys(changeFilters).reduce((prev, key) => {
          const value = changeFilters[key];
          if (!value || value.length === 0) {
            return prev;
          }

          return {
            ...prev,
            [key]: enumsColumnsDataIndex.includes(key) ? value : value[0],
          };
        }, {});

        if (isUrlState) {
          setUrlState({
            filter: stringify(filterValue),
            pageNumber: propsPagination ? 1 : undefined,
          });
        } else {
          setFilter(filterValue);
          action.resetPageIndex();
        }
        break;
      }
      case 'sort': {
        let sorterValue;
        if (Array.isArray(changeSorter)) {
          const data = changeSorter.reduce<Record<string, any>>((pre, value) => {
            if (!value.order) {
              return pre;
            }

            const key = Array.isArray(value.field) ? value.field.join('.') : value.field;

            return {
              ...pre,
              [`${key}`]: transformSortOrder(value.order),
            };
          }, {});
          sorterValue = omitEmpty(data);
        } else if (changeSorter.order) {
          const key = Array.isArray(changeSorter.field)
            ? changeSorter.field.join('.')
            : changeSorter.field;

          sorterValue = omitEmpty({
            [`${key}`]: transformSortOrder(changeSorter.order),
          });
        }

        if (isUrlState) {
          setUrlState({ sorter: stringify(sorterValue) });
        } else {
          setSorter(sorterValue);
        }
        break;
      }
      default:
        break;
    }
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
        searchValue={search && search[searchName]}
        onSearch={(keyword) => {
          if (options && options.search) {
            if (isUrlState) {
              setUrlState({ search: keyword, pageNumber: propsPagination ? 1 : undefined });
            } else {
              setSearch({
                [searchName]: keyword,
              });
              action.resetPageIndex();
            }
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
  const dataSource = request ? (action.dataSource as T[]) : props.dataSource || [];
  const tableDom = (
    <ATable<T>
      {...rest}
      {...(counter.editable && editableProps)}
      rowKey={rowKey}
      rowSelection={propsRowSelection === false ? undefined : rowSelection}
      columns={
        counter.columns.filter((item) => {
          // ????????????????????????
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
        }) as any
      }
      loading={action.loading || props.loading}
      dataSource={dataSource}
      pagination={pagination}
      onChange={onTableChange}
    />
  );

  return (
    <div
      className={classNames(`${CLASS_NAME_PREFIX}-table`, { [`${className}`]: className })}
      style={style}
      ref={rootRef}
    >
      {searchForm && (
        <SearchForm
          values={searchFormParams}
          onSearch={(values) => {
            if (isUrlState) {
              setUrlState({
                searchForm: stringify(values),
                pageNumber: propsPagination ? 1 : undefined,
              });
            } else {
              setSearchFormParams(values);
              action.resetPageIndex();
            }
          }}
          {...searchForm}
        />
      )}

      {extraRender && (
        <div className={`${CLASS_NAME_PREFIX}-table-extra`}>
          {extraRender(extraRenderParams as any)}
        </div>
      )}

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

const ProviderWarp = <T, U = Record<string, any>>(props: TableProps<T, U>) => (
  <Container.Provider initialState={props}>
    <Table {...props} />
  </Container.Provider>
);

export default ProviderWarp;
