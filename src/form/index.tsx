import type { Rule, RuleObject, RuleRender } from 'rc-field-form/lib/interface';
import type { FormInstance } from 'antd/lib/form/Form';
import { useForm } from 'antd/lib/form/Form';
import type { ErrorListProps } from 'antd/lib/form/ErrorList';
import ErrorList from 'antd/lib/form/ErrorList';
import type { FormListProps } from 'antd/lib/form/FormList';
import List from 'antd/lib/form/FormList';
import { FormProvider } from 'antd/lib/form/context';
import type { FormItemProps } from './FormItem';
import Item from './FormItem';
import type { FormProps, FormItemPropsExt } from './Form';
import InternalForm from './Form';

type InternalFormType = typeof InternalForm;

interface FormInterface extends InternalFormType {
  useForm: typeof useForm;
  Item: typeof Item;
  List: typeof List;
  ErrorList: typeof ErrorList;
  Provider: typeof FormProvider;
}

const Form = InternalForm as FormInterface;

Form.Item = Item;
Form.List = List;
Form.ErrorList = ErrorList;
Form.useForm = useForm;
Form.Provider = FormProvider;

export type {
  FormInstance,
  FormProps,
  FormItemProps,
  ErrorListProps,
  Rule,
  RuleObject,
  RuleRender,
  FormListProps,
  FormItemPropsExt,
};

export default Form;
