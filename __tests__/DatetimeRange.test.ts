import { mount } from '@vue/test-utils';
import DatetimeRange from '../lib/datetime/DateTimeRange';

let wrapper: ReturnType<typeof mount>;

afterEach(() => {
  wrapper.unmount();
});

describe('DatetimeRange', () => {
  it('feat: click dates', async () => {
    const mockFn = jest.fn();
    wrapper = mount(DatetimeRange, {
      props: {
        ['onUpdate:value']: mockFn,
        type: 'datetime',
        value: [new Date(2019, 9, 4, 18), new Date(2019, 9, 6, 12)],
      },
    });
    const td = wrapper.find('.mx-table-date td:nth-child(4)');
    const td2 = wrapper.find('.mx-table-date td:nth-child(5)');
    td.trigger('click');
    await td2.trigger('click');
    expect(mockFn.mock.calls[0][0]).toEqual([new Date(2019, 9, 2, 18), new Date(2019, 9, 3, 12)]);
    let timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.exists()).toBe(true);
    await timeTitle.trigger('click');
    timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.exists()).toBe(false);
    td.trigger('click');
    await td.trigger('click');
    expect(mockFn.mock.calls[1][0]).toEqual([new Date(2019, 9, 2, 18), new Date(2019, 9, 2, 18)]);
  });

  it('feat: disabled time', async () => {
    const mockFn = jest.fn();
    const disabledDate = (date: Date) => date < new Date(2019, 9, 2);
    const disabledTime = (date: Date) => date < new Date(2019, 9, 2, 12);
    wrapper = mount(DatetimeRange, {
      props: {
        ['onUpdate:value']: mockFn,
        defaultValue: [new Date(2019, 9, 1), new Date(2019, 9, 1, 12)],
        disabledDate,
        disabledTime,
      },
    });
    const td = wrapper.find('.mx-table-date td:nth-child(4)');
    td.trigger('click');
    await td.trigger('click');
    expect(mockFn).not.toHaveBeenCalled();
    const timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.text()).toBe('2019-10-02');
    const defaultValue = [new Date(2019, 9, 2, 12), new Date(2019, 9, 2, 12)];
    await wrapper.setProps({ defaultValue });
    await td.trigger('click');
    await td.trigger('click');
    expect(mockFn.mock.calls[0][0]).toEqual(defaultValue);
  });
});
