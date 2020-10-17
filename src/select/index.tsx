import ASelect from 'antd/lib/select';
import InternalSelect from './Select';

export * from './interfaces';

type InternalSelectType = typeof InternalSelect;

interface SelectInterface extends InternalSelectType {
  Option: typeof ASelect.Option;
  OptGroup: typeof ASelect.OptGroup;
}

const Select = InternalSelect as SelectInterface;

Select.Option = ASelect.Option;
Select.OptGroup = ASelect.OptGroup;

export default Select;
