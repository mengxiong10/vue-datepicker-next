import { mount } from '@vue/test-utils';
import TimeRange from '../lib/time/TimeRange';

let wrapper: ReturnType<typeof mount>;

afterEach(() => {
  wrapper.unmount();
});

describe('TimeRange', () => {
  it('render: correct classes of the columns', () => {
    wrapper = mount(TimeRange, {
      props: {
        format: 'hh:mm a',
        minuteStep: 30,
        hourStep: 2,
        value: [new Date(2019, 9, 4, 8, 30, 0), new Date(2019, 9, 4, 18, 30, 0)],
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('feat: change the end time when start > end', () => {
    const mockFn = jest.fn();
    wrapper = mount(TimeRange, {
      props: {
        value: [new Date(2019, 9, 4, 8, 30, 0), new Date(2019, 9, 4, 18, 30, 0)],
        ['onUpdate:value']: mockFn,
      },
    });
    const hour = wrapper.find('[data-type=hour] li:nth-child(20)');
    hour.trigger('click');
    expect(mockFn.mock.calls[0][0]).toEqual([
      new Date(2019, 9, 4, 19, 30, 0),
      new Date(2019, 9, 4, 19, 30, 0),
    ]);
  });

  it('supports defaultValue is Array', () => {
    wrapper = mount(TimeRange, {
      props: {
        defaultValue: [new Date(2019, 9, 1, 10), new Date(2019, 11, 1, 12)],
      },
    });
    const actived = wrapper.findAll('.active');
    expect(actived[0].text()).toBe('10');
    expect(actived[3].text()).toBe('12');
  });
});
