import React, { FC } from 'react';
import AFormItem, { FormItemProps as AFormItemProps } from 'antd/lib/form/FormItem';

export interface FormItemProps extends AFormItemProps {
  span?: number;
}

const FormItem: FC<FormItemProps> = ({ span, ...restProps }) => <AFormItem {...restProps} />;

FormItem.defaultProps = {
  validateFirst: true,
};

export default FormItem;
