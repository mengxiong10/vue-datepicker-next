import { mount, VueWrapper } from '@vue/test-utils';
import DatePicker from '../lib/DatePicker';
import '../lib/locale/zh-cn';

let wrapper: VueWrapper<any>;

afterEach(() => {
  wrapper.unmount();
});

describe('Locale', () => {
  it('render the correct default locale', () => {
    wrapper = mount(DatePicker, {
      props: {
        value: new Date(2019, 9, 10),
        open: true,
        appendToBody: false,
      },
    });
    expect(wrapper.find('.mx-table-date th').text()).toBe('一');
    expect(wrapper.find('.mx-table-date td').attributes('title')).toBe('2019-09-30');
  });

  it('prop: lang - string', async () => {
    wrapper = mount(DatePicker, {
      props: {
        value: new Date(2019, 9, 10),
        open: true,
        lang: 'en',
        titleFormat: 'MMM DD, YYYY',
        appendToBody: false,
      },
    });
    expect(wrapper.find('.mx-table-date th').text()).toBe('Su');
    expect(wrapper.find('.mx-table-date .active').attributes('title')).toBe('Oct 10, 2019');
    expect(wrapper.find('.mx-btn-current-month').text()).toBe('Oct');
    await wrapper.find('.mx-btn-current-month').trigger('click');
    expect(wrapper.find('.mx-table-month td').text()).toBe('Jan');
    wrapper.setProps({ lang: 'zh-cn' });
    await wrapper.find('.mx-table-month td > div').trigger('click');
    expect(wrapper.find('.mx-table-date th').text()).toBe('一');
    expect(wrapper.find('.mx-table-date .active').attributes('title')).toBe('10月 10, 2019');
    expect(wrapper.find('.mx-btn-current-month').text()).toBe('10月');
    await wrapper.find('.mx-btn-current-month').trigger('click');
    expect(wrapper.find('.mx-table-month td').text()).toBe('1月');
  });

  it('prop: lang - object', () => {
    wrapper = mount(DatePicker, {
      props: {
        open: true,
        appendToBody: false,
        lang: {
          formatLocale: {
            firstDayOfWeek: 2,
          },
          days: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
        },
      },
    });
    expect(wrapper.find('.mx-table-date th').text()).toBe('周二');
  });
});
