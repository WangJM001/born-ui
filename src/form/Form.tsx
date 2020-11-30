import React, { forwardRef, ReactNode } from 'react';
import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import { FormInstance, FormProps as AFormProps } from 'antd/lib/form';
import { Col, Form as AForm, Row } from 'antd';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { Breakpoint, responsiveArray } from 'antd/lib/_util/responsiveObserve';
import Item, { FormItemProps } from './FormItem';
import defaultRender from './defaultRender';
import { CLASS_NAME_PREFIX } from '../constants';

export type DataType = DataBaseType | DataEnumType;

/**
 * currency 金额
 * textarea 文本框
 * option 操作 需要返回一个数组
 * date 日期 YYYY/MM/DD
 * dateRange 日期范围 YYYY/MM/DD[]
 * dateTime 日期和时间 YYYY/MM/DD HH:mm:ss
 * dateTimeRange 范围日期和时间 YYYY/MM/DD HH:mm:ss[]
 * percent: 百分比
 * number: 数值
 */
export type DataBaseType =
  | 'currency'
  | 'textarea'
  | 'date'
  | 'dateRange'
  | 'dateTimeRange'
  | 'dateTime'
  | 'text'
  | 'percent'
  | 'number';

export type DataEnumType = {
  type: 'enum';
  values: { [key: string]: ReactNode };
};

export interface FormItemPropsExt extends Omit<FormItemProps, 'children'> {
  key?: React.Key;
  dataType?: DataType;
  render?: () => React.ReactNode;
  width?: number | string;
}

export interface FormProps extends AFormProps {
  column?: number | Partial<Record<Breakpoint, number>>;
  items?: FormItemPropsExt[];
}

function mergeItems(items: FormItemPropsExt[] = [], children: React.ReactNode, column: number) {
  const className = `${CLASS_NAME_PREFIX}-form-grid-item`;
  let childNodes = children;
  if (column) {
    childNodes = toArray(children)
      .filter((n) => n)
      .map((node, index) => {
        const span: number | undefined = node.props?.span;
        const mergedSpan = span || 1;
        return (
          <Col
            // eslint-disable-next-line react/no-array-index-key
            key={`item-${index}`}
            className={className}
            style={{ width: `${(mergedSpan * 100) / column}%` }}
          >
            {node}
          </Col>
        );
      });
  }

  const itemNodes = items?.map(
    ({ key, dataType, render, name, span = 1, width, style, ...rest }, i) => {
      const item = (
        <Item key={key || name?.toString() || i} name={name} style={{ ...style, width }} {...rest}>
          {render ? render() : defaultRender(dataType)}
        </Item>
      );
      return column ? (
        <Col
          key={`item-${name?.toString() || i}`}
          className={className}
          style={{ width: `${(span * 100) / column}%` }}
        >
          {item}
        </Col>
      ) : (
        item
      );
    },
  );

  return column ? (
    <Row gutter={[24, 0]}>
      {childNodes}
      {itemNodes}
    </Row>
  ) : (
    <>
      {childNodes}
      {itemNodes}
    </>
  );
}

const Form = forwardRef<FormInstance<any>, FormProps>(
  ({ items, children, column, layout, className: propsClassName, form, ...restProps }, ref) => {
    const className = `${CLASS_NAME_PREFIX}-form`;

    const screens = useBreakpoint();
    const currentBreakpoint = React.useMemo(() => {
      for (let i = 0; i < responsiveArray.length; i += 1) {
        const breakpoint: Breakpoint = responsiveArray[i];
        if (screens[breakpoint]) {
          return breakpoint;
        }
      }
      return undefined;
    }, [screens]);

    const mergedColumn =
      column && currentBreakpoint && column[currentBreakpoint] ? column[currentBreakpoint] : column;

    return (
      <AForm
        ref={ref}
        className={classNames(className, propsClassName)}
        layout={layout}
        {...(layout === 'horizontal' && {
          labelCol: { span: 6 },
          wrapperCol: { span: 14 },
        })}
        form={form}
        onKeyPress={(e) => {
          // Enter
          if (e.key === 'Enter' && form) {
            form.submit();
          }
        }}
        {...restProps}
      >
        {mergeItems(items, children, mergedColumn)}
      </AForm>
    );
  },
);

Form.defaultProps = {
  layout: 'horizontal',
  scrollToFirstError: true,
};

export default Form;
