import defaultRenderText, { ColumnsDataType } from './defaultRender';
import Table, {
  ActionType,
  ColumnsState,
  ColumnsType,
  FilterType,
  SorterType,
  TableProps,
} from './Table';

export type {
  TableProps,
  ColumnsState,
  ColumnsDataType,
  ColumnsType,
  ActionType,
  FilterType,
  SorterType as SortType,
};
export { defaultRenderText };

export default Table;
