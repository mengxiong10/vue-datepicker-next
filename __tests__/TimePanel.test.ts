import { mount } from '@vue/test-utils';
import TimePanel from '../lib/time/TimePanel';

let wrapper: ReturnType<typeof mount>;

afterEach(() => {
  wrapper.unmount();
});

describe('TimePanel', () => {
  it('render: correct classes of the columns', () => {
    wrapper = mount(TimePanel, {
      props: {
        use12h: true,
        defaultValue: new Date(2019, 9, 4, 12, 40, 30),
        disabledTime: (date: Date) => date.getTime() > new Date(2019, 9, 4, 13, 30, 30).getTime(),
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('render: correct columns by format', () => {
    wrapper = mount(TimePanel, {
      props: {
        value: new Date(2019, 9, 4),
        format: 'hh:mm a',
        minuteStep: 30,
        hourOptions: Array.from({ length: 10 }).map((_, i) => i + 8),
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('render: correct classes of the fixed time list', () => {
    wrapper = mount(TimePanel, {
      props: {
        value: new Date(2019, 10, 9, 12, 30),
        disabledTime: (date: Date) => date.getHours() < 10,
        timePickerOptions: {
          start: '08:30',
          step: '00:30',
          end: '18:30',
        },
        format: 'HH:mm',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('render: correct 12hours in the fixed time list', () => {
    wrapper = mount(TimePanel, {
      props: {
        value: new Date(2019, 10, 9, 12, 30),
        timePickerOptions: {
          start: '08:30',
          step: '00:30',
          end: '18:30',
        },
        format: 'hh:mm A',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
  });

  it('feat: emit select event when click', async () => {
    const mockFn = jest.fn();
    wrapper = mount(TimePanel, {
      props: {
        format: 'hh:mm:ss a',
        defaultValue: new Date(2019, 9, 10, 2),
        ['onUpdate:value']: mockFn,
      },
    });
    const hour = wrapper.find('[data-type=hour] li:nth-child(2)');
    await hour.trigger('click');
    expect(mockFn.mock.calls[0][0]).toEqual(new Date(2019, 9, 10, 1));
    await wrapper.setProps({ value: new Date(2019, 9, 10, 1) });
    const minute = wrapper.find('[data-type=minute] li:nth-child(2)');
    minute.trigger('click');
    expect(mockFn.mock.calls[1][0]).toEqual(new Date(2019, 9, 10, 1, 1));
    await wrapper.setProps({ value: new Date(2019, 9, 10, 1, 1) });
    const second = wrapper.find('[data-type=second] li:nth-child(2)');
    second.trigger('click');
    expect(mockFn.mock.calls[2][0]).toEqual(new Date(2019, 9, 10, 1, 1, 1));
    await wrapper.setProps({ value: new Date(2019, 9, 10, 1, 1, 1) });
    const pm = wrapper.find('[data-type=ampm] li:nth-child(2)');
    pm.trigger('click');
    expect(mockFn.mock.calls[3][0]).toEqual(new Date(2019, 9, 10, 13, 1, 1));
  });

  it('feat: disabledTime should not emit event', () => {
    const mockFn = jest.fn();
    wrapper = mount(TimePanel, {
      props: {
        value: new Date(2019, 9, 4, 12, 30, 30),
        disabledTime: (date: Date) => date.getHours() < 10,
        ['onUpdate:value']: mockFn,
      },
    });
    const hour = wrapper.find('[data-type=hour] li:nth-child(2)');
    hour.trigger('click');
    expect(mockFn).not.toHaveBeenCalled();
  });
});
