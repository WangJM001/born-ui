import React, { PropsWithChildren } from 'react';
import { Divider, message, Select } from 'antd';
import Form, { Rule } from 'antd/lib/form';
import isEqual from 'lodash/isEqual';
import DatePicker from '../date-picker';
import Input from '../input';
import InputNumber from '../input-number';
import { ColumnType } from './Table';
import InputPercent from '../input-percent';
import Container from './container';
import { isOptionColumn } from './utils';
import { CLASS_NAME_PREFIX } from '../constants';

const FormItem = Form.Item;

function filterOption(input: string, option: any) {
  return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
}

export function genCellEditor<T, U = {}>(
  record: T,
  editor: ColumnType<T>['editor'],
  dataType: ColumnType<T>['dataType'],
): React.ReactNode {
  if (typeof editor === 'function') {
    return editor(record);
  }

  /**
   * 按dataType自动生成
   */
  if (editor === true) {
    if (typeof dataType === 'function' && record) {
      return genCellEditor(record, editor, dataType(record));
    }

    /**
     * 如果是枚举的值
     */
    if (typeof dataType === 'object' && dataType.type === 'enum') {
      return (
        <Select
          placeholder="请选择"
          options={Object.entries(dataType.values).map(([key, value]) => ({
            label: value,
            value: key,
          }))}
          showSearch
          allowClear
          filterOption={filterOption}
        />
      );
    }

    /**
     * 如果是金额、数字
     */
    if (dataType === 'currency' || dataType === 'number') {
      return <InputNumber />;
    }

    /**
     *如果是日期的值
     */
    if (dataType === 'date') {
      return <DatePicker />;
    }

    /**
     *如果是日期范围的值
     */
    if (dataType === 'dateRange') {
      return <DatePicker.RangePicker />;
    }

    /**
     *如果是日期加时间类型的值
     */
    if (dataType === 'dateTime') {
      return <DatePicker showTime />;
    }

    /**
     *如果是日期加时间类型的值的值
     */
    if (dataType === 'dateTimeRange') {
      return <DatePicker.RangePicker showTime />;
    }

    /**
     * 如果是百分比
     */
    if (dataType === 'percent') {
      return <InputPercent />;
    }

    return <Input />;
  }

  return editor;
}

export interface EditableCellProps<T> {
  index?: number;
  record: T;
  dataIndex: React.Key;
  dataType: ColumnType['dataType'];
  editor: React.ReactNode;
  editorName?: string | string[];
  rules: Rule[];
  title: string;
}

const isFormValChange = <T, U = {}>(formVal: T, record: T): boolean =>
  !isEqual({ ...record, ...formVal }, record);

const EditableCell = <T, U = {}>({
  index,
  title,
  record,
  dataIndex,
  dataType,
  editor,
  editorName,
  children,
  rules = [],
  ...restProps
}: PropsWithChildren<EditableCellProps<T>>) => {
  const className = `${CLASS_NAME_PREFIX}-table-editable-cell`;
  const counter = Container.useContainer();
  const editing = counter.isEditing(record || {});

  const editSave = () => {
    if (!index && index !== 0) return;

    counter.editFormRef.current
      ?.validateFields()
      .then((row: any) => {
        const { onEditSave } = counter.propsRef.current || {};
        if (onEditSave && isFormValChange(row as T, record)) {
          onEditSave(row as T, record, index).then((res) => {
            const { action } = counter;

            if (index > -1) {
              action.current?.setDataSource((dataSource: T[]) => {
                const item = dataSource[index];
                dataSource.splice(
                  index,
                  1,
                  res?.data || {
                    ...item,
                    ...row,
                  },
                );

                return [...dataSource];
              });
            }

            counter.setEditingKey(undefined);
            message.success('保存成功');
          });
        } else {
          counter.setEditingKey(undefined);
        }
      })
      .catch((e: Error) => {
        message.error(`错误：${e.message}`);
        counter.setEditingKey(undefined);
      });
  };

  let dom = children;
  if (editing) {
    if (editor) {
      dom = (
        <FormItem
          name={editorName || dataIndex}
          label={title}
          validateFirst
          rules={rules}
          className={`${className}-form-item`}
        >
          {genCellEditor(record, editor, dataType)}
        </FormItem>
      );
    } else if (isOptionColumn(record, dataType)) {
      dom = (
        <>
          <a onClick={editSave}>保存</a>
          <Divider type="vertical" />
          <a onClick={() => counter.setEditingKey(undefined)}>取消</a>
        </>
      );
    }
  } else if ((counter.editingKey || counter.editingKey === 0) && isOptionColumn(record, dataType)) {
    dom = <span className={`${className}-option-disabled`}>{children}</span>;
  }

  return <td {...restProps}>{dom}</td>;
};

export default EditableCell;
