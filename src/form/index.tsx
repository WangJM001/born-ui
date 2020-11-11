import { Rule, RuleObject, RuleRender } from 'rc-field-form/lib/interface';
import { useForm, FormInstance } from 'antd/lib/form/Form';
import ErrorList, { ErrorListProps } from 'antd/lib/form/ErrorList';
import List, { FormListProps } from 'antd/lib/form/FormList';
import { FormProvider } from 'antd/lib/form/context';
import Item, { FormItemProps } from './FormItem';
import InternalForm, { FormProps, FormItemPropsExt } from './Form';

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
