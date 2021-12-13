import { mount } from '@vue/test-utils';
import Datetime from '../lib/datetime/DateTime';

let wrapper: ReturnType<typeof mount>;

afterEach(() => {
  wrapper.unmount();
});

describe('DatetimePanel', () => {
  it('feat: click date', async () => {
    const mockFn = jest.fn();
    wrapper = mount(Datetime, {
      props: {
        type: 'datetime',
        defaultValue: new Date(2019, 9, 1, 12, 10, 10),
        ['onUpdate:value']: mockFn,
      },
    });
    const td = wrapper.find('.mx-table-date td:nth-child(4)');
    await td.trigger('click');
    expect(mockFn.mock.calls[0][0]).toEqual(new Date(2019, 9, 2, 12, 10, 10));
    let timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.exists()).toBe(true);
    await timeTitle.trigger('click');
    timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.exists()).toBe(false);
  });

  it('feat: disabled time', async () => {
    const mockFn = jest.fn();
    const disabledDate = (date: Date) => date < new Date(2019, 9, 2);
    const disabledTime = (date: Date) => date < new Date(2019, 9, 2, 12);
    wrapper = mount(Datetime, {
      props: {
        ['onUpdate:value']: mockFn,
        defaultValue: new Date(2019, 9, 2, 10),
        disabledDate,
        disabledTime,
      },
    });
    const td = wrapper.find('.mx-table-date td:nth-child(4)');
    await td.trigger('click');
    expect(mockFn).not.toHaveBeenCalled();
    const timeTitle = wrapper.find('.mx-time-header-title');
    expect(timeTitle.text()).toBe('2019-10-02');
    // set the defaultValue is not disabled
    const defaultValue = new Date(2019, 9, 2, 12);
    await wrapper.setProps({ defaultValue });
    await td.trigger('click');
    expect(mockFn.mock.calls[0][0]).toEqual(defaultValue);
  });
});
