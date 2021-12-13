import { mount, VueWrapper } from '@vue/test-utils';
import { parse, format } from 'date-format-parse';
import { nextTick } from 'vue';
import DatePicker from '../lib/DatePicker';

const shallowMount = mount;

let wrapper: VueWrapper<any>;

afterEach(() => {
  wrapper.unmount();
});

const getPopupVisible = () => {
  return wrapper.find('.mx-datepicker-popup').exists();
};

describe('DatePicker', () => {
  it('feat: open and close the popup', async () => {
    wrapper = mount(DatePicker, {
      attachTo: document.body,
      props: {
        appendToBody: false,
      },
    });
    expect(getPopupVisible()).toBe(false);
    // expect click input should show the popup
    const input = wrapper.find('input');
    await input.trigger('click');
    expect(getPopupVisible()).toBe(true);
    // expect click out side should hide the popup
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await nextTick();
    expect(getPopupVisible()).toBe(false);
    // expect focus input should show the popop
    await input.trigger('focus');
    expect(getPopupVisible()).toBe(true);
    // expoce keydown tab should hide the popup
    await input.trigger('keydown.tab');
    expect(getPopupVisible()).toBe(false);

    // should close popup when click time in datetime mode
    await input.trigger('click');
    await wrapper.setProps({
      type: 'datetime',
      timePickerOptions: {
        start: '00:00',
        step: '00:30',
        end: '10:30',
      },
      showTimePanel: true,
    });
    await wrapper.find('.mx-time-option').trigger('click');
    expect(getPopupVisible()).toBe(false);
  });

  it('prop: open', async () => {
    const mockFn = jest.fn();
    wrapper = mount(DatePicker, {
      props: {
        open: false,
        appendToBody: false,
        ['onUpdate:open']: mockFn,
      },
    });
    const input = wrapper.find('input');

    await input.trigger('focus');
    expect(getPopupVisible()).toBe(false);
    await wrapper.setProps({ open: true });
    expect(getPopupVisible()).toBe(true);
    await input.trigger('keydown.tab');
    expect(getPopupVisible()).toBe(true);
    expect(mockFn.mock.calls[0][0]).toBe(true);
    expect(mockFn.mock.calls[1][0]).toBe(false);
  });

  it('feat: should init panel and calendar when reopen', async () => {
    wrapper = mount(DatePicker, {
      props: {
        defaultValue: new Date(2019, 9, 1),
        open: true,
        appendToBody: false,
      },
    });
    const yearBtn = wrapper.find('.mx-btn-current-year');
    await yearBtn.trigger('click');
    // change to year panel
    expect(wrapper.find('.mx-calendar-panel-year').exists()).toBe(true);
    await wrapper.setProps({ open: false });
    await wrapper.setProps({ open: true });
    expect(wrapper.find('.mx-calendar-panel-year').exists()).toBe(false);
  });

  it('prop: disabled(should not show the popup)', () => {
    wrapper = mount(DatePicker, {
      props: {
        disabled: true,
      },
    });
    const input = wrapper.find('input');
    expect(input.attributes('disabled')).not.toBeUndefined();
    input.trigger('click');
    expect(wrapper.find('.mx-datepicker-popup').exists()).toBe(false);
  });

  it('prop: input props', () => {
    wrapper = shallowMount(DatePicker, {
      props: {
        value: new Date(2019, 4, 10),
      },
      slots: {
        content: '<div></div>',
      },
    });
    expect(wrapper.element).toMatchSnapshot();
    wrapper.setProps({
      clearable: false,
      editable: false,
      placeholder: 'test placeholder',
      inputClass: 'test',
      inputAttr: {
        type: 'number',
        name: 'test',
        id: 'test',
      },
    });
  });

  it('prop: format', () => {
    wrapper = shallowMount(DatePicker, {
      props: {
        format: 'YYYY/MM/DD',
        value: new Date(2019, 9, 10),
      },
    });
    const input = wrapper.find('input').element;
    expect(input.value).toBe('2019/10/10');
  });

  it('prop: formatter', () => {
    wrapper = mount(DatePicker, {
      props: {
        valueType: 'format',
        value: '13/Oct/2019',
        open: true,
        type: 'week',
        appendToBody: false,
        formatter: {
          stringify(date) {
            return format(date, 'DD/MMM/YYYY');
          },
          parse(value) {
            return parse(value, 'DD/MMM/YYYY');
          },
          getWeek(date) {
            return date.getDate();
          },
        },
      },
    });
    const input = wrapper.find('input').element;
    expect(input.value).toBe('13/Oct/2019');
  });

  it('prop: valueType', async () => {
    const value = new Date(2019, 9, 20);
    const mockFn = jest.fn();
    wrapper = shallowMount(DatePicker, {
      props: {
        appendToBody: false,
        value: value,
        format: 'YYYY/MM/DD',
        open: true,
        onChange: mockFn,
      },
    });
    const cell = wrapper.find('[title="2019-10-01"]');
    const input = wrapper.find('input').element;
    expect(input.value).toBe('2019/10/20');
    cell.trigger('click');
    await wrapper.setProps({ valueType: 'format', value: '2019/10/20' });
    expect(input.value).toBe('2019/10/20');
    cell.trigger('click');
    await wrapper.setProps({ valueType: 'timestamp', value: value.getTime() });
    expect(input.value).toBe('2019/10/20');
    cell.trigger('click');
    await wrapper.setProps({ valueType: 'DD/MM/YYYY', value: '20/10/2019' });
    expect(input.value).toBe('2019/10/20');
    cell.trigger('click');
    expect(mockFn.mock.calls).toEqual([
      [new Date(2019, 9, 1)],
      ['2019/10/01'],
      [new Date(2019, 9, 1).getTime()],
      ['01/10/2019'],
    ]);
  });

  it('prop: shortcut', async () => {
    const date = new Date(2019, 4, 10);
    const mockFn = jest.fn();
    wrapper = shallowMount(DatePicker, {
      props: {
        open: true,
        valueType: 'YYYY/MM/DD',
        appendToBody: false,
        onChange: mockFn,
        shortcuts: [
          {
            text: 'Today',
            onClick() {
              return date;
            },
          },
        ],
      },
    });
    await wrapper.find('.mx-btn-shortcut').trigger('click');
    expect(mockFn).toHaveBeenCalledWith('2019/05/10');
    await wrapper.setProps({
      range: true,
      shortcuts: [
        {
          text: 'range',
          onClick() {
            return [date, date];
          },
        },
      ],
    });
    await wrapper.find('.mx-btn-shortcut').trigger('click');
    expect(mockFn).toHaveBeenLastCalledWith(['2019/05/10', '2019/05/10']);
  });

  it('prop: popupClass & popupStyle', () => {
    wrapper = mount(DatePicker, {
      props: {
        open: true,
        appendToBody: false,
        popupClass: 'test',
        popupStyle: {
          top: '20px',
        },
      },
    });
    const popup = wrapper.find('.mx-datepicker-popup');
    expect(popup.classes()).toContain('test');
    expect((popup.element as HTMLElement).style.top).toBe('20px');
  });

  it('prop: confirm & confirmText', async () => {
    const mockFn = jest.fn();
    wrapper = shallowMount(DatePicker, {
      props: {
        value: new Date(2021, 10, 11),
        confirm: true,
        confirmText: 'test',
        appendToBody: false,
        onChange: mockFn,
      },
    });
    await wrapper.find('input').trigger('focus');
    const btn = wrapper.find('.mx-datepicker-btn-confirm');
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toBe('test');
    wrapper.find('td.cell').trigger('click');
    expect(mockFn).not.toHaveBeenCalled();
    expect(getPopupVisible()).toBe(true);
    await btn.trigger('click');
    expect(mockFn).toHaveBeenCalledWith(new Date(2021, 9, 31));
    expect(getPopupVisible()).toBe(false);
  });

  [true, false].forEach((item) => {
    it(`prop: appendToBody = ${item}`, () => {
      wrapper = mount(DatePicker, {
        props: {
          open: true,
          appendToBody: item,
        },
        slots: {
          content: '',
        },
        attachTo: document.body,
      });
      expect(document.body).toMatchSnapshot();
    });
  });

  it('feat: should emit clear event when click clear button', async () => {
    const mockClearFn = jest.fn();
    const mockChangeFn = jest.fn();
    wrapper = shallowMount(DatePicker, {
      props: {
        range: false,
        value: new Date(2019, 10, 9),
        onClear: mockClearFn,
        onChange: mockChangeFn,
      },
    });
    wrapper.find('.mx-icon-clear').trigger('click');
    expect(mockClearFn).toHaveBeenCalled();
    expect(mockChangeFn).toHaveBeenCalledWith(null);
    await wrapper.setProps({ value: [new Date(), new Date()], range: true });
    wrapper.find('.mx-icon-clear').trigger('click');
    expect(mockChangeFn).toHaveBeenLastCalledWith([null, null]);
  });
  // present the button submit form
  it('the type of all buttons should be button', () => {
    wrapper = mount(DatePicker, {
      props: {
        open: true,
        showTimePanel: true,
        appendToBody: false,
      },
    });
    const els = wrapper.findAll('button');
    els.forEach((v) => {
      expect(v.element.type).toBe('button');
    });
  });

  it('should emit pick event on first click', () => {
    const mockFn = jest.fn();
    wrapper = mount(DatePicker, {
      props: {
        range: true,
        open: true,
        defaultValue: new Date(2019, 9, 1),
        appendToBody: false,
        onPick: mockFn,
      },
    });
    const td = wrapper.find('.mx-table-date td');
    td.trigger('click');
    expect(mockFn).toHaveBeenCalledWith(new Date(2019, 8, 29));
  });

  it('Ignore whitespace around separator on manual range input', async () => {
    const separator = ' ~ ';
    const text = '2020-02-12';
    const mockFn = jest.fn();
    wrapper = mount(DatePicker, {
      props: {
        separator,
        range: true,
        valueType: 'format',
        onChange: mockFn,
      },
    });
    const input = wrapper.find('input');

    await input.setValue(`${text} ${separator} ${text}`);
    await input.trigger('change');
    await input.setValue(`${text}${separator.trim()}${text}`);
    await input.trigger('change');
    await wrapper.setProps({ separator: ' - ' });
    await input.setValue(`${text} - ${text}`);
    await input.trigger('change');
    expect(mockFn.mock.calls).toEqual([[[text, text]], [[text, text]], [[text, text]]]);
  });

  it('prop: multiple', () => {
    const value = [new Date(2020, 5, 6), new Date(2020, 6, 7)];
    const mockFn = jest.fn();
    wrapper = mount(DatePicker, {
      props: {
        multiple: true,
        open: true,
        appendToBody: false,
        value,
        onChange: mockFn,
      },
    });
    wrapper.find('.mx-date-row .active').trigger('click');
    expect(mockFn.mock.calls[0][0]).toEqual(value.slice(0, 1));
    wrapper.find('[title="2020-07-15"]').trigger('click');
    expect(mockFn.mock.calls[1][0]).toEqual(value.concat(new Date(2020, 6, 15)));
  });

  it('If the value entered manually is in the disabled range should be invalid', () => {
    const someday = new Date(2020, 6, 1);
    const mockFn = jest.fn();
    const inputErrorFn = jest.fn();
    wrapper = shallowMount(DatePicker, {
      props: {
        format: 'YYYY-MM-DD',
        disabledDate: (date) => {
          return date < someday;
        },
        onChange: mockFn,
        onInputError: inputErrorFn,
      },
    });
    const textInput = wrapper.find('input');
    textInput.setValue('2020-08-01');
    textInput.trigger('change');
    expect(mockFn.mock.calls[0][0]).toEqual(new Date(2020, 7, 1));
    textInput.setValue('2020-05-01');
    textInput.trigger('change');
    expect(mockFn.mock.calls[1]).toBe(undefined);
    expect(inputErrorFn).toHaveBeenCalledWith('2020-05-01');
  });
});
