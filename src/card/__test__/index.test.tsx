import React from 'react';
import { mount } from 'enzyme';
import Card from '..';
import mountTest from '../../../tests/shared/mountTest';
import { CLASS_NAME_PREFIX } from '../../constants';

describe('Card', () => {
  mountTest(Card);

  it('should show header bottom border correctly', () => {
    const wrapper = mount(<Card title="card-title">Content</Card>);
    expect(
      wrapper.find(`Card.${CLASS_NAME_PREFIX}-card.${CLASS_NAME_PREFIX}-card-without-header-split`),
    ).toHaveLength(1);

    wrapper.setProps({ headerSplit: true });
    expect(
      wrapper.find(`Card.${CLASS_NAME_PREFIX}-card.${CLASS_NAME_PREFIX}-card-without-header-split`),
    ).toHaveLength(0);

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('should show ghost mode correctly', () => {
    const wrapper = mount(<Card title="card-title">Content</Card>);
    expect(
      wrapper.find(`Card.${CLASS_NAME_PREFIX}-card.${CLASS_NAME_PREFIX}-card-ghost`),
    ).toHaveLength(0);
    wrapper.setProps({ ghost: true });
    expect(
      wrapper.find(`Card.${CLASS_NAME_PREFIX}-card.${CLASS_NAME_PREFIX}-card-ghost`),
    ).toHaveLength(1);

    expect(wrapper.render()).toMatchSnapshot();
  });

  it('should show border correctly', () => {
    const wrapper = mount(<Card title="card-title">Content</Card>);
    expect(wrapper.find(`.${CLASS_NAME_PREFIX}-card.ant-card-bordered`)).toHaveLength(0);

    wrapper.setProps({ bordered: true });
    expect(wrapper.find(`.${CLASS_NAME_PREFIX}-card.ant-card-bordered`)).toHaveLength(1);

    expect(wrapper.render()).toMatchSnapshot();
  });
});
