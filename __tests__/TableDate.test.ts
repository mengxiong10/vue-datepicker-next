import { mount, VueWrapper } from '@vue/test-utils';
import { FunctionalComponent } from 'vue';
import { TableDate } from '../lib/calendar/TableDate';

let wrapper: VueWrapper<any>;

afterEach(() => {
  wrapper.unmount();
});

describe('TableDate', () => {
  it('corrent render', () => {
    wrapper = mount(TableDate as FunctionalComponent<any>, {
      props: {
        isWeekMode: false,
        showWeekNumber: true,
        getWeekActive: () => false,
        getCellClasses: () => [],
        calendar: new Date(2019, 9, 1, 0, 0, 0),
        titleFormat: 'DD/MM/YYYY',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });
});
