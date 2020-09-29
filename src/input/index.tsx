import React, { FC } from 'react';
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

const TextArea: FC<TextAreaProps> = (props) => {
  return <AInput.TextArea {...props} />;
};

TextArea.defaultProps = {
  placeholder: '请输入',
};

Input.Group = AInput.Group;
Input.Search = AInput.Search;
Input.TextArea = TextArea;
Input.Password = AInput.Password;

export default Input;
