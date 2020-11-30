import React from 'react';
import { SortableContainer, SortableElement, SortEnd } from '@utech/react-sortable-hoc';
import arrayMove from 'array-move';
import { PushpinOutlined, SettingOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons';
import { Checkbox, Popover, Tooltip } from 'antd';
import { ColumnsType, ColumnType } from 'antd/lib/table';
import { CLASS_NAME_PREFIX } from '../constants';
import Container from './container';
import { genColumnKey } from './utils';
import { ColumnsState } from './Table';

interface ColumnSettingProps<T = any> {
  columns?: ColumnsType<T>;
}

const ToolTipIcon: React.FC<{
  title: string;
  columnKey: string | number;
  show: boolean;
  fixed: 'left' | 'right' | undefined;
}> = ({ title, show, children, columnKey, fixed }) => {
  const { columnsMap, setColumnsMap } = Container.useContainer();
  if (show) {
    return (
      <Tooltip title={title}>
        <span
          onClick={() => {
            const config = columnsMap[columnKey || ''] || {};
            const columnKeyMap = {
              ...columnsMap,
              [columnKey]: { ...config, fixed } as ColumnsState,
            };
            setColumnsMap(columnKeyMap);
          }}
        >
          {children}
        </span>
      </Tooltip>
    );
  }
  return null;
};

const CheckboxListItem: React.FC<{
  columnKey: string | number;
  className?: string;
  title?: React.ReactNode;
  columnsMap: {
    [key: string]: ColumnsState;
  };
  fixed?: boolean | 'left' | 'right';
  setColumnsMap: (map: { [key: string]: ColumnsState }) => void;
}> = ({ columnKey, className, columnsMap, title, setColumnsMap, fixed }) => {
  const config = columnsMap[columnKey || 'null'] || { show: true };
  return (
    <span className={`${className}-list-item`} key={columnKey}>
      <Checkbox
        onChange={(e) => {
          if (columnKey) {
            const tempConfig = columnsMap[columnKey || ''] || {};
            const newSetting = { ...tempConfig };
            if (e.target.checked) {
              delete newSetting.show;
            } else {
              newSetting.show = false;
            }
            const columnKeyMap = {
              ...columnsMap,
              [columnKey]: newSetting as ColumnsState,
            };
            setColumnsMap(columnKeyMap);
          }
        }}
        checked={config.show !== false}
      >
        {title}
      </Checkbox>
      <span className={`${className}-list-item-option`}>
        <ToolTipIcon columnKey={columnKey} fixed="left" title="固定到左边" show={fixed !== 'left'}>
          <PushpinOutlined
            style={{
              transform: 'rotate(-90deg)',
            }}
          />
        </ToolTipIcon>
        <ToolTipIcon columnKey={columnKey} fixed={undefined} title="取消固定" show={!!fixed}>
          <VerticalAlignMiddleOutlined />
        </ToolTipIcon>
        <ToolTipIcon
          columnKey={columnKey}
          fixed="right"
          title="固定到右边"
          show={fixed !== 'right'}
        >
          <PushpinOutlined />
        </ToolTipIcon>
      </span>
    </span>
  );
};
const SortableCheckboxListItem = SortableElement(CheckboxListItem);

const CheckboxListSortableContainer = SortableContainer(
  ({ children }: { children: React.ReactNode }) => {
    return <div>{children}</div>;
  },
);

const CheckboxList: React.FC<{
  list: (ColumnType<any> & { index?: number })[];
  className?: string;
  title: string;
  showTitle?: boolean;
}> = ({ list, className, showTitle = true, title: listTitle }) => {
  const { columnsMap, setColumnsMap, sortKeyColumns, setSortKeyColumns } = Container.useContainer();
  const show = list && list.length > 0;
  if (!show) {
    return null;
  }
  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    const newColumns = [...sortKeyColumns];
    setSortKeyColumns(arrayMove(newColumns, oldIndex, newIndex));
  };

  const listDom = list.map(({ key, dataIndex, title, fixed, ...rest }, index) => {
    const columnKey = genColumnKey(key, dataIndex, rest.index);
    return (
      <SortableCheckboxListItem
        key={columnKey}
        index={index}
        setColumnsMap={setColumnsMap}
        columnKey={columnKey || `${index}`}
        columnsMap={columnsMap}
        title={title}
        fixed={fixed}
        className={className}
      />
    );
  });
  return (
    <CheckboxListSortableContainer onSortEnd={onSortEnd}>
      {showTitle && <span className={`${className}-list-title`}>{listTitle}</span>}
      {listDom}
    </CheckboxListSortableContainer>
  );
};

const GroupCheckboxList: React.FC<{
  localColumns: ColumnType<any>[];
  className?: string;
}> = ({ localColumns, className }) => {
  const rightList: ColumnType<any>[] = [];
  const leftList: ColumnType<any>[] = [];
  const list: ColumnType<any>[] = [];

  localColumns.forEach((item) => {
    const { fixed } = item;
    if (fixed === 'left') {
      leftList.push(item);
      return;
    }
    if (fixed === 'right') {
      rightList.push(item);
      return;
    }
    list.push(item);
  });

  const showRight = rightList && rightList.length > 0;
  const showLeft = leftList && leftList.length > 0;

  return (
    <div className={`${className}-list`}>
      <CheckboxList title="固定在左侧" list={leftList} className={className} />
      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        list={list}
        title="不固定"
        showTitle={showLeft || showRight}
        className={className}
      />
      <CheckboxList title="固定在右侧" list={rightList} className={className} />
    </div>
  );
};

const ColumnSetting = <T, U = {}>(props: ColumnSettingProps<T>) => {
  const counter = Container.useContainer();
  const localColumns: Omit<ColumnType<T> & { index?: number }, 'ellipsis'>[] =
    props.columns || counter.columns || [];
  const { columnsMap, setColumnsMap, setSortKeyColumns } = counter;
  /**
   * 设置全部选中，或全部未选中
   * @param show
   */
  const setAllSelectAction = (show: boolean = true) => {
    const columnKeyMap: Record<string, any> = {};
    localColumns.forEach(({ key, fixed, dataIndex, index }) => {
      const columnKey = genColumnKey(key, dataIndex, index);
      if (columnKey) {
        columnKeyMap[columnKey] = {
          show,
          fixed,
        };
      }
    });
    setColumnsMap(columnKeyMap);
  };

  // 选中的 key 列表
  const selectedKeys = Object.values(columnsMap).filter((value) => !value || value.show === false);

  // 是否已经选中
  const indeterminate = selectedKeys.length > 0 && selectedKeys.length !== localColumns.length;

  const className = `${CLASS_NAME_PREFIX}-table-column-setting`;
  const toolbarClassName = `${CLASS_NAME_PREFIX}-table-toolbar`;
  return (
    <Popover
      arrowPointAtCenter
      title={
        <div className={`${className}-title`}>
          <Checkbox
            indeterminate={indeterminate}
            checked={selectedKeys.length === 0 && selectedKeys.length !== localColumns.length}
            onChange={(e) => {
              if (e.target.checked) {
                setAllSelectAction();
              } else {
                setAllSelectAction(false);
              }
            }}
          >
            列展示
          </Checkbox>
          <a
            onClick={() => {
              setColumnsMap({});
              setSortKeyColumns([]);
            }}
          >
            重置
          </a>
        </div>
      }
      overlayClassName={`${className}-overlay`}
      trigger="click"
      placement="bottomRight"
      content={<GroupCheckboxList className={className} localColumns={localColumns} />}
    >
      <Tooltip title="列设置">
        <SettingOutlined
          className={`${toolbarClassName}-item-icon`}
          style={{
            fontSize: 16,
          }}
        />
      </Tooltip>
    </Popover>
  );
};

export default ColumnSetting;
