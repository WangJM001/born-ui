# Born UI

`born-ui` 是基于 `antd` 的 React UI 组件库

在 `antd` 组件库的基础上新添加了一些常用组件，扩展了一些原有组件

原 `antd` 组件可以通过 `born-ui` 直接使用

## 📦 安装

```bash
npm install @utech/born-ui --save
```

```bash
yarn add  @utech/born-ui
```

## 🔨 示例

```jsx
import { Button, DatePicker } from '@utech/born-ui';
import '@utech/born-ui/es/button/style';
import '@utech/born-ui/es/date-picker/style';

const App = () => (
  <>
    <Button type="primary">PRESS ME</Button>
    <DatePicker />
  </>
);
```

可以使用`babel-import-plugin`，按需加载，自动引入样式

```jsx
import { Button, DatePicker } from '@utech/born-ui';

const App = () => (
  <>
    <Button type="primary">PRESS ME</Button>
    <DatePicker />
  </>
);
```
