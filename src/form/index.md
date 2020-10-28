---
title: Form
---

# Form

## 功能图谱

<img src='./demos/images/map.png' />

## 数据集方式渲染

<code src="./demos/items-render.tsx" title='items render' desc="根据dataType类型自动渲染组件"/>

## 栅格化显示

<code src="./demos/grid.tsx" title='grid render' desc="栅格化显示"/>

## API

### Form

> 这里只列出与 antd form 不同的 api

| 属性 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| column | 一行的 `Form.Item` 数量，支持响应式的对象写法 `{ xs: 8, sm: 16, md: 24}` | `number` | - |
| items | 数据化配置选项内容 | [FormItemProps](#FormItemProps) | - |

### FormItemProps

> 这里只列出与 antd form item 不同的 api

| 属性     | 描述                               | 类型                 | 默认值 |
| -------- | ---------------------------------- | -------------------- | ------ |
| dataType | 值的类型，[配置项](#datatype-类型) | `ColumnsDataType<T>` | 'text' |
| render   | 渲染表单输入组件                   | `() = > void`        | -      |
| span     | 包含列的数量, 需配合`column`使用   | `number`             | 1      |

#### dataType 类型

封装了一些常用的值类型来减少重复的 `render` 操作，配置一个`dataType` 即可展示表单组件。

现在支持的值如下

| 类型          | 描述           | 组件                     |
| ------------- | -------------- | ------------------------ |
| currency      | 金额           | `InputNumber`            |
| date          | 日期           | `DatePicker`             |
| dateRange     | 日期区间       | `DatePicker.RangePicker` |
| dateTime      | 日期和时间     | `DatePicker`             |
| dateTimeRange | 日期和时间区间 | `DatePicker.RangePicker` |
| text          | 文本框         | `Input`                  |
| textarea      | 文本域         | `Input.Textarea`         |
| percent       | 百分比         | `InputPercent`           |
| number        | 数字           | `InputNumber`            |
| enum          | 枚举           | `Select`                 |

##### 枚举

```tsx |pure
<Form items={[{
    label:'name',
    name:'name',
    dataType: {
        type: 'enum',
        values: ['0': '值1','1': '值2'],
    },
}]}/>
```
