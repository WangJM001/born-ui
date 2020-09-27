import Table, {
  ColumnsType,
  ActionType,
  TableProps,
  ColumnsState,
  FilterType,
  SortType,
} from './Table';
import defaultRenderText, { ColumnsDataType } from './defaultRender';

export type {
  TableProps,
  ColumnsState,
  ColumnsDataType,
  ColumnsType,
  ActionType,
  FilterType,
  SortType,
};

export { defaultRenderText };

export default Table;
