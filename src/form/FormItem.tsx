import type { FC } from 'react';
import React from 'react';
import type { FormItemProps as AFormItemProps } from 'antd/lib/form/FormItem';
import AFormItem from 'antd/lib/form/FormItem';

export interface FormItemProps extends AFormItemProps {
  span?: number;
}

const FormItem: FC<FormItemProps> = ({ span, ...restProps }) => <AFormItem {...restProps} />;

FormItem.defaultProps = {
  validateFirst: true,
};

export default FormItem;
