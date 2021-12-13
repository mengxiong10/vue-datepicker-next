import { mount } from '@vue/test-utils';
import CalendarRange from '../lib/calendar/CalendarRange';
import Calendar from '../lib/calendar/Calendar';

let wrapper: ReturnType<typeof mount>;

afterEach(() => {
  wrapper.unmount();
});

describe('CalendarRange', () => {
  it('feat: correct classes', () => {
    wrapper = mount(CalendarRange, {
      props: {
        value: [new Date(2019, 9, 30), new Date(2019, 10, 2)],
      },
    });
    const activeTds = wrapper.findAll('.mx-table-date .active:not(.not-current-month)');
    const rangeTds = wrapper.findAll('.mx-table-date .in-range:not(.not-current-month)');
    expect(activeTds.length).toBe(2);
    expect(activeTds[0].text()).toBe('30');
    expect(activeTds[1].text()).toBe('2');
    expect(rangeTds.length).toBe(2);
    expect(rangeTds[0].text()).toBe('31');
    expect(rangeTds[1].text()).toBe('1');
  });

  it('feat: click range', async () => {
    const mockFn = jest.fn();
    wrapper = mount(CalendarRange, {
      props: {
        defaultValue: new Date(2019, 9, 1),
        ['onUpdate:value']: mockFn,
      },
    });
    const tds = wrapper.findAll('.mx-table-date td');
    await tds[2].trigger('click');
    expect(mockFn).not.toHaveBeenCalled();
    await tds[8].trigger('click');
    expect(mockFn).toHaveBeenCalledWith([new Date(2019, 9, 1), new Date(2019, 9, 7)], 'date');
  });

  it('feat: calendars min gap', async () => {
    wrapper = mount(CalendarRange, {
      props: {
        defaultValue: new Date(2019, 6, 1),
      },
    });
    const firstRightIcon = wrapper.find('.mx-calendar-panel-date .mx-btn-icon-right');
    const secondLeftIcon = wrapper.find('.mx-calendar-panel-date:nth-child(2) .mx-btn-icon-left');

    const firstCell = wrapper.find('.mx-calendar-panel-date td');
    const secondCell = wrapper.find('.mx-calendar-panel-date:nth-child(2) td');

    await firstRightIcon.trigger('click');
    expect(firstCell.attributes('title')).toBe('2019-07-28');
    expect(secondCell.attributes('title')).toBe('2019-08-25');
    await secondLeftIcon.trigger('click');
    expect(firstCell.attributes('title')).toBe('2019-06-30');
    expect(secondCell.attributes('title')).toBe('2019-07-28');
  });

  it('partialUpdate should be false', () => {
    wrapper = mount(CalendarRange, {
      props: {
        partialUpdate: true,
      },
    });
    const [start, end] = wrapper.findAllComponents(Calendar);
    expect(start.props('partialUpdate')).toBe(false);
    expect(end.props('partialUpdate')).toBe(false);
  });

  it('supports defaultValue is Array', () => {
    wrapper = mount(CalendarRange, {
      props: {
        defaultValue: [new Date(2019, 9, 1), new Date(2019, 11, 1)],
      },
    });
    const firstCell = wrapper.find('.mx-calendar-panel-date td');
    const secondCell = wrapper.find('.mx-calendar-panel-date:nth-child(2) td');
    expect(firstCell.attributes('title')).toBe('2019-09-29');
    expect(secondCell.attributes('title')).toBe('2019-11-24');
  });
});
