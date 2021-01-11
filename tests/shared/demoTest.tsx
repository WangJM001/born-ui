import React from 'react';
import glob from 'glob';
import { mount, render } from 'enzyme';
import MockDate from 'mockdate';
import dayjs from 'dayjs';

type CheerIO = ReturnType<typeof render>;
type CheerIOElement = CheerIO[0];
// We should avoid use it in 4.0. Reopen if can not handle this.
const USE_REPLACEMENT = false;
const testDist = process.env.LIB_DIR === 'dist';

/**
 * component will generate id for aria usage.
 * It's created as `test-uuid` when env === 'test'.
 * Or `f7fa7a3c-a675-47bc-912e-0c45fb6a74d9`(randomly) when not test env.
 * So we need hack of this to modify the `aria-controls`.
 */
function ariaConvert(wrapper: CheerIO) {
  if (!testDist || !USE_REPLACEMENT) return wrapper;

  const matches = new Map();

  function process(entry: CheerIOElement) {
    const { attribs, children } = entry;
    if (matches.has(entry)) return;
    matches.set(entry, true);

    // Change aria
    if (attribs && attribs['aria-controls']) {
      attribs['aria-controls'] = ''; // Remove all the aria to keep render sync in jest & jest node
    }

    // Loop children
    if (!children) return;
    (Array.isArray(children) ? children : [children]).forEach(process);
  }

  wrapper.each((_: any, entry: any) => process(entry));

  return wrapper;
}

type Options = {
  skip?: boolean;
};

export default function demoTest(component: string, options: Options = {}) {
  const files = glob.sync(`./src/${component}/demos/*.tsx`);

  files.forEach((file) => {
    let testMethod = options.skip === true ? test.skip : test;
    if (Array.isArray(options.skip) && options.skip.some((c) => file.includes(c))) {
      testMethod = test.skip;
    }
    testMethod(`renders ${file} correctly`, () => {
      MockDate.set(dayjs('2020-12-31').valueOf());
      const Demo = require(`../.${file}`).default; // eslint-disable-line global-require, import/no-dynamic-require
      const wrapper = mount(<Demo />);

      const dom = wrapper.render();
      // Convert aria related content
      ariaConvert(dom);

      expect(dom).toMatchSnapshot();
      MockDate.reset();
    });
  });
}
