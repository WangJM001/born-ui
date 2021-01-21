import type { FC } from 'react';
import React, { forwardRef } from 'react';
import type {
  InputProps,
  GroupProps,
  SearchProps,
  TextAreaProps,
  PasswordProps,
} from 'antd/lib/input';
import AInput from 'antd/lib/input';
import type { TextAreaRef } from 'antd/lib/input/TextArea';
import ATextArea from 'antd/lib/input/TextArea';

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

const TextArea = forwardRef<TextAreaRef, TextAreaProps>((props, ref) => {
  return <ATextArea ref={ref} {...props} />;
});

TextArea.defaultProps = {
  placeholder: '请输入',
};

Input.Group = AInput.Group;
Input.Search = AInput.Search;
Input.TextArea = TextArea;
Input.Password = AInput.Password;

export default Input;
