---
title: Select
---

# Select

## 功能图谱

<img src='./images/map.png' />

## 远程请求数据

<code src="./request.tsx" title='请求后台' desc="不分页"/>

<code src="./request-pagination.tsx" title='请求后台' desc="分页，分页模式下 labelInValue 强制为 true，防止设置默认值显示错误"/>

<code src="./request-multiple.tsx" title='多选模式' desc="不分页"/>

## API

> 这里只列出与 antd select 不同的 api

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 获取 `dataSource` 的方法 | `(params?: {pageSize: number;current: number;[key: string]: any;}) => Promise<RequestData<T>>` | - |
| params | 用于 request 查询的多余参数，一旦变化会触发重新加载 | object | - | - |
| formatData | 对通过 `request` 获取的数据进行处理 | `(data: T[]) => T[]` | - |
| transform | 转换`value` `defaultValue` 以及 request 返回的业务数据 | `RawValue \| RawValue[] \| T \| T[]` | - |
| renderOption | 自定义渲染 Option | `(data: T) => React.ReactNode` | - |
| requestReady | 值为 false 时，不执行 request | `boolean` | true |
| onChange | 扩展 value 值，返回原始的业务对象 | `(value: string \| number \| string[] \| number[] \| T \| T[], options: OptionsType \| OptionsType[number]) => void` | true |
| pagination | 滚动分页加载 | `boolean` | false |
| search | 代替 showSearch, string 类型值为分页远程请求时属性名 | `string \| false` | 'keyword' |
