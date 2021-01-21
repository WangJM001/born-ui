import type { StatisticGroupProps } from './StatisticGroup';
import StatisticGroup from './StatisticGroup';
import type { StatisticProps } from './Statistic';
import InternalStatistic from './Statistic';

type InternalStatisticType = typeof InternalStatistic;

interface StatisticInterface extends InternalStatisticType {
  Group: typeof StatisticGroup;
}

const Statistic = InternalStatistic as StatisticInterface;

Statistic.Group = StatisticGroup;

export type { StatisticProps, StatisticGroupProps };

export default Statistic;
