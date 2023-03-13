/* eslint-disable no-await-in-loop */
import { mount, VueWrapper } from '@vue/test-utils';
import locale from 'date-format-parse/lib/locale/en';
import Calendar from '../lib/calendar/Calendar';

let wrapper: VueWrapper<any>;

afterEach(() => {
  wrapper.unmount();
});

describe('CalendarPanel', () => {
  it('feat: type = date, should emit event when click date', () => {
    const mockFn = jest.fn();
    wrapper = mount(Calendar, {
      props: {
        value: new Date(2019, 9, 4),
        ['onUpdate:value']: mockFn,
      },
    });
    wrapper.find('.mx-table-date td').trigger('click');
    expect(mockFn).toHaveBeenCalledWith(new Date(2019, 8, 29), 'date');
  });

  it('feat: type = month, should emit event when click month', () => {
    const mockFn = jest.fn();
    wrapper = mount(Calendar, {
      props: {
        type: 'month',
        defaultValue: new Date(2019, 9, 10),
        ['onUpdate:value']: mockFn,
      },
    });
    wrapper.find('.mx-table-month td > div').trigger('click');
    expect(mockFn).toHaveBeenCalledWith(new Date(2019, 0, 1), 'month');
  });

  it('feat: type = year, should emit event when click year', () => {
    const mockFn = jest.fn();
    wrapper = mount(Calendar, {
      props: {
        type: 'year',
        defaultValue: new Date(2019, 9, 10),
        ['onUpdate:value']: mockFn,
      },
    });
    wrapper.find('.mx-table-year td > div').trigger('click');
    expect(mockFn).toHaveBeenCalledWith(new Date(2010, 0), 'year');
  });

  it('feat: when year >= 0 && year < 100, should be emit right', () => {
    const mockFn = jest.fn();
    wrapper = mount(Calendar, {
      props: {
        type: 'year',
        defaultValue: new Date(new Date().setFullYear(11)),
        ['onUpdate:value']: mockFn,
      },
    });
    wrapper.find('.mx-table-year td > div').trigger('click');
    const expectedDate = new Date(new Date(10, 0).setFullYear(10));
    expect(mockFn).toHaveBeenCalledWith(expectedDate, 'year');
  });

  it('feat: active class', async () => {
    wrapper = mount(Calendar);
    const td = wrapper.find('.mx-table-date td:nth-child(6)');
    expect(td.classes()).not.toContain('active');
    await wrapper.setProps({ value: new Date(2019, 9, 4) });
    expect(td.classes()).toContain('active');
  });

  it('feat: is-start class', async () => {
    wrapper = mount(Calendar);
    const td = wrapper.find('.mx-table-date td:nth-child(6)');
    expect(td.classes()).not.toContain('is-start');
    await wrapper.setProps({ value: new Date(2019, 9, 4) });
    expect(td.classes()).toContain('is-start');
  });

  it('feat: is-end class', async () => {
    wrapper = mount(Calendar);
    const td = wrapper.find('.mx-table-date td:nth-child(6)');
    expect(td.classes()).not.toContain('is-end');
    await wrapper.setProps({ value: new Date(2019, 9, 4) });
    expect(td.classes()).toContain('is-end');
  });

  it('prop: disabledDate', () => {
    const disabledDate = (date: Date) => {
      return date < new Date(2019, 9, 1) || date > new Date(2019, 9, 20);
    };
    const mockFn = jest.fn();
    wrapper = mount(Calendar, {
      props: {
        value: new Date(2019, 9, 4),
        ['onUpdate:value']: mockFn,
        disabledDate,
      },
    });
    const tds = wrapper.findAll('.mx-table-date td');
    for (let i = 0; i < 42; i++) {
      const td = tds[i];
      const classes = td.classes();
      if (i < 2 || i > 21) {
        expect(classes).toContain('disabled');
      } else {
        expect(classes).not.toContain('disabled');
      }
    }
    tds[1].trigger('click');
    expect(mockFn).not.toHaveBeenCalled();
  });

  const renderType = (type: 'date' | 'month' | 'year') => {
    it(`prop: type=${type}`, () => {
      wrapper = mount(Calendar, {
        props: {
          type,
          value: new Date(2019, 9, 1, 10),
        },
      });
      expect(wrapper.classes()).toContain(`mx-calendar-panel-${type}`);
    });
  };
  (['date', 'month', 'year'] as const).forEach(renderType);

  it('prop: defaultPanel', () => {
    wrapper = mount(Calendar, {
      props: {
        open: true,
        type: 'month',
        defaultPanel: 'year',
      },
    });
    expect(wrapper.classes()).toContain('mx-calendar-panel-year');
  });

  it('feat: panel change', async () => {
    wrapper = mount(Calendar);
    await wrapper.find('.mx-btn-current-year').trigger('click');
    expect(wrapper.classes()).toContain('mx-calendar-panel-year');
    await wrapper.find('.mx-table-year td > div').trigger('click');
    expect(wrapper.classes()).toContain('mx-calendar-panel-month');
    await wrapper.find('.mx-table-month td > div').trigger('click');
    expect(wrapper.classes()).toContain('mx-calendar-panel-date');
    await wrapper.find('.mx-btn-current-month').trigger('click');
    expect(wrapper.classes()).toContain('mx-calendar-panel-month');
    await wrapper.find('.mx-calendar-header-label > button').trigger('click');
    expect(wrapper.classes()).toContain('mx-calendar-panel-year');
  });

  it('feat: click prev/next month', async () => {
    wrapper = mount(Calendar);
    const nextBtn = wrapper.find('.mx-btn-icon-right');
    const lastBtn = wrapper.find('.mx-btn-icon-left');
    const year = wrapper.find('.mx-btn-current-year');
    const month = wrapper.find('.mx-btn-current-month');
    const getCurrentYear = () => parseInt(year.text(), 10);
    const getCurrentMonth = () => locale.monthsShort.indexOf(month.text());
    let count = 12;
    while (count--) {
      const oldYear = getCurrentYear();
      const oldMonth = getCurrentMonth();
      await nextBtn.trigger('click');
      const newYear = getCurrentYear();
      const newMonth = getCurrentMonth();
      if (oldMonth === 11) {
        expect(newMonth).toBe(0);
        expect(newYear).toBe(oldYear + 1);
      } else {
        expect(newMonth).toBe(oldMonth + 1);
        expect(newYear).toBe(oldYear);
      }
    }
    count = 12;
    while (count--) {
      const oldYear = getCurrentYear();
      const oldMonth = getCurrentMonth();
      await lastBtn.trigger('click');
      const newYear = getCurrentYear();
      const newMonth = getCurrentMonth();
      if (oldMonth === 0) {
        expect(newMonth).toBe(11);
        expect(newYear).toBe(oldYear - 1);
      } else {
        expect(newMonth).toBe(oldMonth - 1);
        expect(newYear).toBe(oldYear);
      }
    }
  });

  ['date', 'month'].forEach((type) => {
    it(`feat: click prev/next year in ${type} panel`, async () => {
      wrapper = mount(Calendar, {
        props: {
          value: new Date(2018, 4, 5),
          defaultPanel: type as 'date' | 'month',
        },
      });
      const nextBtn = wrapper.find('.mx-btn-icon-double-right');
      const lastBtn = wrapper.find('.mx-btn-icon-double-left');
      const year = wrapper.find('.mx-btn-current-year');
      const getCurrentYear = () => parseInt(year.text(), 10);
      expect(getCurrentYear()).toBe(2018);
      await nextBtn.trigger('click');
      expect(getCurrentYear()).toBe(2019);
      await lastBtn.trigger('click');
      expect(getCurrentYear()).toBe(2018);
    });
  });

  it('feat: click prev/next decade', async () => {
    wrapper = mount(Calendar, {
      props: {
        value: new Date(2018, 4, 5),
        defaultPanel: 'year',
      },
    });
    const nextBtn = wrapper.find('.mx-btn-icon-double-right');
    const lastBtn = wrapper.find('.mx-btn-icon-double-left');
    const year = wrapper.find('td.active');
    const getCurrentYear = () => parseInt(year.text(), 10);
    await nextBtn.trigger('click');
    expect(getCurrentYear()).toBe(2028);
    await lastBtn.trigger('click');
    expect(getCurrentYear()).toBe(2018);
  });

  it('feat: select year to change the calendar', async () => {
    wrapper = mount(Calendar, {
      props: {
        value: new Date(2018, 4, 5),
        defaultPanel: 'year',
      },
    });
    await wrapper.find('.mx-table-year td > div').trigger('click');
    expect(wrapper.find('.mx-btn-current-year').text()).toBe('2010');
    await wrapper.find('.mx-table-month td > div').trigger('click');
    expect(wrapper.find('.mx-btn-current-month').text()).toBe(locale.monthsShort[0]);
  });

  it('prop: partialUpdate', async () => {
    const mockFn = jest.fn();
    wrapper = mount(Calendar, {
      props: {
        value: new Date(2019, 9, 4),
        partialUpdate: true,
        defaultPanel: 'year',
        ['onUpdate:value']: mockFn,
      },
    });
    wrapper.find('.mx-table-year td > div').trigger('click');
    expect(mockFn).toHaveBeenCalledWith(new Date(2010, 9, 4), 'year');
    await wrapper.setProps({ value: new Date(2010, 9, 4) });
    wrapper.find('.mx-table-month td > div').trigger('click');
    expect(mockFn).toHaveBeenLastCalledWith(new Date(2010, 0, 4), 'month');
  });
});
