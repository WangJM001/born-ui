import StatisticGroup, { StatisticGroupProps } from './StatisticGroup';
import InternalStatistic, { StatisticProps } from './Statistic';

type InternalStatisticType = typeof InternalStatistic;

interface StatisticInterface extends InternalStatisticType {
  Group: typeof StatisticGroup;
}

const Statistic = InternalStatistic as StatisticInterface;

Statistic.Group = StatisticGroup;

export type { StatisticProps, StatisticGroupProps };

export default Statistic;
