import { mount, VueWrapper } from '@vue/test-utils';
import { FunctionalComponent } from 'vue';
import { TableYear } from '../lib/calendar/TableYear';

let wrapper: VueWrapper<any>;

afterEach(() => {
  wrapper.unmount();
});

describe('TableYear', () => {
  it('decade=2010', () => {
    wrapper = mount(TableYear as FunctionalComponent<any>, {
      props: {
        calendar: new Date(2019, 9, 1, 0, 0, 0),
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
