import React from 'react';
import useMergeValue from 'use-merge-value';
import { ReloadOutlined, SettingOutlined } from '@ant-design/icons';
import { Divider, Space, Tooltip, Input } from 'antd';
import { SearchProps } from 'antd/lib/input';
import { CLASS_NAME_PREFIX } from '../../constants';
import ColumnSetting from '../ColumnSetting';
import { UseFetchDataAction } from '../hooks/useFetchData';
import FullScreenIcon from './FullscreenIcon';

export interface OptionConfig {
  fullScreen?: boolean;
  reload?: boolean;
  setting?: boolean;
  search?: (SearchProps & { name?: string }) | boolean;
}

export interface ToolbarProps<T = unknown> {
  headerTitle?: React.ReactNode;
  toolbar?:
    | React.ReactNode[]
    | ((
        action: UseFetchDataAction<T>,
        rows: {
          selectedRowKeys?: (string | number)[];
          selectedRows?: T[];
        },
      ) => React.ReactNode[]);
  action: UseFetchDataAction<T>;
  options?: OptionConfig | false;
  selectedRowKeys?: (string | number)[];
  selectedRows?: T[];
  searchValue?: string;
  onSearch?: (keyWords: string) => void;
}

const getButtonText = <T, U = {}>(action: UseFetchDataAction<T>) => ({
  fullScreen: {
    text: '全屏',
    icon: <FullScreenIcon />,
    action: () => action.fullScreen && action.fullScreen(),
  },
  reload: {
    text: '刷新',
    icon: <ReloadOutlined />,
    action: action.reload,
  },
  setting: {
    text: '列设置',
    icon: <SettingOutlined />,
  },
});

/**
 * 渲染默认的 工具栏
 * @param options
 * @param className
 */
const renderDefaultOption = <T, U = {}>(
  action: UseFetchDataAction<T>,
  options: ToolbarProps<T>['options'],
  className: string,
) =>
  options &&
  Object.entries(options)
    .map(([key, value]) => {
      if (!value) {
        return null;
      }
      if (key === 'setting') {
        return <ColumnSetting key={key} />;
      }

      const optionItem = getButtonText<T>(action)[key as 'fullScreen' | 'reload'];
      if (optionItem) {
        return (
          <span key={key} className={className} onClick={optionItem.action}>
            <Tooltip title={optionItem.text}>{optionItem.icon}</Tooltip>
          </span>
        );
      }
      return null;
    })
    .filter((item) => item);

const Toolbar = <T, U = {}>({
  headerTitle,
  toolbar = [],
  action,
  options: propsOptions = {
    fullScreen: false,
    reload: false,
    setting: false,
    search: false,
  },
  selectedRowKeys,
  selectedRows,
  searchValue: propSearchValue,
  onSearch,
}: ToolbarProps<T>) => {
  const className = `${CLASS_NAME_PREFIX}-table-toolbar`;
  const [value, setValue] = useMergeValue(propSearchValue);
  const options = propsOptions
    ? {
        fullScreen: false,
        reload: false,
        setting: false,
        search: false,
        ...propsOptions,
      }
    : false;
  const optionDom = renderDefaultOption<T>(action, options, `${className}-item-icon`) || [];
  // 操作列表
  const actions =
    typeof toolbar === 'function' ? toolbar(action, { selectedRowKeys, selectedRows }) : toolbar;
  const renderDivider = () => {
    if (optionDom.length < 1) {
      return false;
    }
    if (actions.length < 1 && options && options.search === false) {
      return false;
    }
    return <Divider type="vertical" />;
  };

  return (
    <div className={className}>
      <div className={`${className}-title`}>{headerTitle}</div>
      <div className={`${className}-option`}>
        <Space>
          {options && options.search && (
            <Input.Search
              className={`${className}-option-search`}
              value={value}
              placeholder="请输入"
              allowClear
              {...options.search}
              onSearch={onSearch}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
          )}
          {actions
            .filter((item) => item)
            .map((node, index) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={index}
              >
                {node}
              </div>
            ))}
        </Space>
        <div className={`${className}-default-option`}>
          {renderDivider()}
          <Space>{optionDom}</Space>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
