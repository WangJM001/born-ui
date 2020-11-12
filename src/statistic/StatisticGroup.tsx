import React, { useState, useRef, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import classNames from 'classnames';
import { AppstoreOutlined } from '@ant-design/icons';
import { CLASS_NAME_PREFIX } from '../constants';

export interface StatisticGroupProps {
  className?: string;
  children: React.ReactElement[];
  max?: number;
  expandable?: boolean;
}

const StatisticGroup: React.FC<StatisticGroupProps> = ({
  children,
  className: propsClassName,
  max = 4,
  expandable = true,
}) => {
  const className = `${CLASS_NAME_PREFIX}-statistic-group`;

  const colRef = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState(false);
  const [singleRowHeight, setSingleRowHeight] = useState(0);

  const cards = React.Children.toArray(children);

  const showExpand = expandable && cards.length > max;

  useEffect(() => {
    setSingleRowHeight(colRef.current?.offsetHeight || 0);
  }, []);

  return (
    <Card bordered={false} className={classNames(className, propsClassName)}>
      <div className={`${className}-left`}>
        <Row className={`${className}-left-row`}>
          {cards.map((card, index) => (
            <Col
              className={classNames(`${className}-left-col`, {
                [`${className}-left-col-hidden`]: index >= max && !expand && expandable,
              })}
              flex={`${100 / max}%`}
              // eslint-disable-next-line react/no-array-index-key
              key={index}
            >
              <Card className={`${className}-left-item`} bordered={false}>
                {card}
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      {showExpand && (
        <div
          className={`${className}-right`}
          ref={colRef}
          style={singleRowHeight > 0 ? { maxHeight: singleRowHeight } : undefined}
        >
          <div className={`${className}-right-expand`} onClick={() => setExpand(!expand)}>
            <div className={`${className}-right-expand-icon`}>
              <AppstoreOutlined />
            </div>
            <div className={`${className}-right-expand-text`}>{expand ? '收起' : '全部'}</div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatisticGroup;
