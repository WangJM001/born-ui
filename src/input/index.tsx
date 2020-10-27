import React, { FC, forwardRef } from 'react';
import AInput, {
  InputProps,
  GroupProps,
  SearchProps,
  TextAreaProps,
  PasswordProps,
} from 'antd/lib/input';

export type { InputProps, GroupProps, SearchProps, TextAreaProps, PasswordProps };

interface InputInstance extends FC<InputProps> {
  Group: typeof AInput.Group;
  Search: typeof AInput.Search;
  TextArea: FC<TextAreaProps>;
  Password: typeof AInput.Password;
}

const Input: InputInstance = (props) => {
  return <AInput {...props} />;
};

Input.defaultProps = {
  placeholder: '请输入',
};

const TextArea = forwardRef<unknown, TextAreaProps>((props, ref) => {
  return <AInput.TextArea ref={ref} {...props} />;
});

TextArea.defaultProps = {
  placeholder: '请输入',
};

Input.Group = AInput.Group;
Input.Search = AInput.Search;
Input.TextArea = TextArea;
Input.Password = AInput.Password;

export default Input;
