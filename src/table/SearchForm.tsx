import { DoubleRightOutlined } from '@ant-design/icons';
import { Button, Card, Space } from 'antd';
import classNames from 'classnames';
import React, { FC, useEffect } from 'react';
import useMergeValue from 'use-merge-value';
import { CLASS_NAME_PREFIX } from '../constants';
import Form, { FormInstance, FormItemPropsExt } from '../form';
import defaultRender from '../form/defaultRender';

export interface SearchFormProps {
  defaultCollapsed?: boolean;
  collapsed?: boolean;
  onCollapsedChange?: (collapse: boolean) => void;
  form?: FormInstance;
  // 数组第二项为折叠内容
  items: [FormItemPropsExt[]] | [FormItemPropsExt[], FormItemPropsExt[]];
  initialValues?: Record<string, any>;
  values?: Record<string, any>;
  onSearch: (params: Record<string, any>) => void;
}

const SearchForm: FC<SearchFormProps> = ({
  defaultCollapsed,
  collapsed: propsCollapsed,
  onCollapsedChange,
  initialValues,
  items,
  form: propsForm,
  values,
  onSearch,
}) => {
  const className = `${CLASS_NAME_PREFIX}-table-search-form`;
  const [form] = Form.useForm(propsForm);
  const [collapsed, setCollapsed] = useMergeValue<boolean>(!!defaultCollapsed, {
    value: propsCollapsed,
    onChange: onCollapsedChange,
  });

  useEffect(() => {
    form.setFieldsValue(values);
  }, [values]);

  return (
    <Card bordered={false} className={className}>
      <div className={`${className}-wrapper`}>
        <Form
          layout="inline"
          form={form}
          onFinish={onSearch}
          initialValues={initialValues}
          onKeyPress={(e) => {
            // Enter
            if (e.key === 'Enter') {
              form.submit();
            }
          }}
        >
          {items[0].map(({ dataType, render, name, width, style, ...rest }, i) => (
            <Form.Item
              key={name?.toString() || i}
              name={name}
              style={{ ...style, width }}
              {...rest}
            >
              {render ? render() : defaultRender(dataType)}
            </Form.Item>
          ))}

          <div className={classNames(`${className}-collapse-wrapper`, { collapsed })}>
            {items[1] &&
              items[1].length > 0 &&
              items[1].map(({ dataType, render, name, width, style, ...rest }, i) => (
                <Form.Item
                  key={name?.toString() || i}
                  name={name}
                  style={{ ...style, width }}
                  {...rest}
                >
                  {render ? render() : defaultRender(dataType)}
                </Form.Item>
              ))}
          </div>
        </Form>
      </div>
      <div className={`${className}-actions`}>
        <Space align="end">
          <Button onClick={form.submit}>查询</Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>

          {items.length > 1 && (
            <div className={`${className}-collapsed`} onClick={() => setCollapsed(!collapsed)}>
              <DoubleRightOutlined rotate={collapsed ? 90 : -90} />
            </div>
          )}
        </Space>
      </div>
    </Card>
  );
};

SearchForm.defaultProps = {
  defaultCollapsed: true,
};

export default SearchForm;
