import type { ColumnsDataType } from './defaultRender';
import defaultRenderText from './defaultRender';
import type {
  ActionType,
  ColumnsState,
  ColumnsType,
  FilterType,
  SorterType,
  TableProps,
} from './Table';
import Table from './Table';

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
