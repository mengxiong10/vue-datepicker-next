import { parse, format, getWeek } from 'date-format-parse';
import { DeepPartial } from 'utility-types';
import { computed, toRef, ref, watchEffect, SetupContext, StyleValue } from 'vue';
import { provideGetWeek, provideLocale, providePrefixClass } from './context';
import Popup from './Popup';
import PickerInput, { PickerInputBaseProps, pickerInputBaseProps } from './PickerInput';
import { isPlainObject, pick } from './util/base';
import { ClassValue, DateValue, Formatter, Locale, PickerType, Valuetype } from './type';
import { isValidDate } from './util/date';
import { defineVueComponent, keys, withDefault } from './vueUtil';

export interface PickerBaseProps {
  type?: PickerType;
  format?: string;
  value?: DateValue;
  valueType?: Valuetype;
  formatter?: Formatter;
  lang?: string | DeepPartial<Locale>;
  prefixClass?: string;
  appendToBody?: boolean;
  open?: boolean;
  popupClass?: ClassValue;
  popupStyle?: StyleValue;
  confirm?: boolean;
  confirmText?: string;
  shortcuts?: Array<{ text: string; onClick: () => Date | Date[] }>;
  disabledDate?: (v: Date) => boolean;
  disabledTime?: (v: Date) => boolean;
  onClose?: () => void;
  onOpen?: () => void;
  onConfirm?: (v: any) => void;
  onChange?: (v: any, type?: string) => void;
  ['onUpdate:open']?: (open: boolean) => void;
  ['onUpdate:value']?: (v: any) => void;
  required?: boolean;
}

export type PickerProps = PickerBaseProps & PickerInputBaseProps;

export interface SlotProps {
  value: any;
  ['onUpdate:value']: (value: any, type: string) => void;
  emit: (value: any, type?: string, close?: boolean) => void;
}

function Picker(originalProps: PickerProps, { slots }: SetupContext) {
  const props = withDefault(originalProps, {
    prefixClass: 'mx',
    valueType: 'date',
    format: 'YYYY-MM-DD',
    type: 'date' as PickerType,
    disabledDate: () => false,
    disabledTime: () => false,
    confirmText: 'OK',
    required: false,
  });

  providePrefixClass(props.prefixClass);
  provideGetWeek(props.formatter?.getWeek || getWeek);
  const locale = provideLocale(toRef(originalProps, 'lang'));

  const container = ref<HTMLDivElement>();

  const getContainer = () => container.value;

  const defaultOpen = ref(false);

  const popupVisible = computed(() => {
    return !props.disabled && (typeof props.open === 'boolean' ? props.open : defaultOpen.value);
  });

  const openPopup = () => {
    if (props.disabled || popupVisible.value) return;
    defaultOpen.value = true;
    props['onUpdate:open']?.(true);
    props.onOpen?.();
  };

  const closePopup = () => {
    if (!popupVisible.value) return;
    defaultOpen.value = false;
    props['onUpdate:open']?.(false);
    props.onClose?.();
  };

  const formatDate = (date: Date, fmt?: string): string => {
    fmt = fmt || props.format;
    if (isPlainObject(props.formatter) && typeof props.formatter.stringify === 'function') {
      return props.formatter.stringify(date, fmt);
    }
    return format(date, fmt, { locale: locale.value.formatLocale });
  };

  const parseDate = (value: string, fmt?: string): Date => {
    fmt = fmt || props.format;
    if (isPlainObject(props.formatter) && typeof props.formatter.parse === 'function') {
      return props.formatter.parse(value, fmt);
    }
    const backupDate = new Date();
    return parse(value, fmt, { locale: locale.value.formatLocale, backupDate });
  };

  const value2date = (value: unknown) => {
    switch (props.valueType) {
      case 'date':
        return value instanceof Date ? new Date(value.getTime()) : new Date(NaN);
      case 'timestamp':
        return typeof value === 'number' ? new Date(value) : new Date(NaN);
      case 'format':
        return typeof value === 'string' ? parseDate(value) : new Date(NaN);
      default:
        return typeof value === 'string' ? parseDate(value, props.valueType) : new Date(NaN);
    }
  };

  const date2value = (date: Date | null) => {
    if (!isValidDate(date)) return null;
    switch (props.valueType) {
      case 'date':
        return date;
      case 'timestamp':
        return date.getTime();
      case 'format':
        return formatDate(date);
      default:
        return formatDate(date, props.valueType);
    }
  };

  const innerValue = computed(() => {
    const value = props.value;
    if (props.range) {
      return (Array.isArray(value) ? value.slice(0, 2) : [null, null]).map(value2date);
    }
    if (props.multiple) {
      return (Array.isArray(value) ? value : []).map(value2date);
    }
    return value2date(value);
  });

  const emitValue = (date: Date | Date[] | null | null[], type?: string, close = true) => {
    const value = Array.isArray(date) ? date.map(date2value) : date2value(date);
    props['onUpdate:value']?.(value);
    props.onChange?.(value, type);
    if (close) {
      closePopup();
    }
    return value;
  };

  // cache
  const currentValue = ref<Date | Date[]>(new Date());
  watchEffect(() => {
    if (popupVisible.value) {
      currentValue.value = innerValue.value;
    }
  });

  const handleSelect = (val: Date | Date[], type: string) => {
    if (props.confirm) {
      currentValue.value = val;
    } else {
      // type === 'datetime', click the time should close popup
      emitValue(val, type, !props.multiple && (type === props.type || type === 'time'));
    }
  };

  const handleConfirm = () => {
    const value = emitValue(currentValue.value);
    props.onConfirm?.(value);
  };

  const disabledDateTime = (v: Date) => {
    return props.disabledDate(v) || props.disabledTime(v);
  };

  const renderSidebar = (slotProps: SlotProps) => {
    const { prefixClass } = props;
    return (
      <div class={`${prefixClass}-datepicker-sidebar`}>
        {slots.sidebar?.(slotProps)}
        {(props.shortcuts || []).map((v, i) => (
          <button
            key={i}
            data-index={i}
            type="button"
            class={`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-shortcut`}
            onClick={() => {
              const date = v.onClick?.();
              if (date) {
                emitValue(date);
              }
            }}
          >
            {v.text}
          </button>
        ))}
      </div>
    );
  };

  return () => {
    const { prefixClass, disabled, confirm, range, popupClass, popupStyle, appendToBody } = props;

    const slotProps = {
      value: currentValue.value,
      ['onUpdate:value']: handleSelect,
      emit: emitValue,
    };

    const header = slots.header && (
      <div class={`${prefixClass}-datepicker-header`}>{slots.header(slotProps)}</div>
    );

    const footer = (slots.footer || confirm) && (
      <div class={`${prefixClass}-datepicker-footer`}>
        {slots.footer?.(slotProps)}
        {confirm && (
          <button
            type="button"
            class={`${prefixClass}-btn ${prefixClass}-datepicker-btn-confirm`}
            onClick={handleConfirm}
          >
            {props.confirmText}
          </button>
        )}
      </div>
    );

    const content = slots.content?.(slotProps);

    const sidedar = (slots.sidebar || props.shortcuts) && renderSidebar(slotProps);

    return (
      <div
        ref={container}
        class={{
          [`${prefixClass}-datepicker`]: true,
          [`${prefixClass}-datepicker-range`]: range,
          disabled,
        }}
      >
        <PickerInput
          {...pick(props, pickerInputBaseProps)}
          value={innerValue.value}
          formatDate={formatDate}
          parseDate={parseDate}
          disabledDate={disabledDateTime}
          onChange={emitValue}
          onClick={openPopup}
          onFocus={openPopup}
          onBlur={closePopup}
          v-slots={pick(slots, ['icon-calendar', 'icon-clear', 'input'])}
        />
        <Popup
          className={popupClass}
          style={popupStyle}
          visible={popupVisible.value}
          appendToBody={appendToBody}
          getRelativeElement={getContainer}
          onClickOutside={closePopup}
        >
          {sidedar}
          <div class={`${prefixClass}-datepicker-content`}>
            {header}
            {content}
            {footer}
          </div>
        </Popup>
      </div>
    );
  };
}

const pickerbaseProps = keys<PickerBaseProps>()([
  'value',
  'valueType',
  'type',
  'format',
  'formatter',
  'lang',
  'prefixClass',
  'appendToBody',
  'open',
  'popupClass',
  'popupStyle',
  'confirm',
  'confirmText',
  'shortcuts',
  'disabledDate',
  'disabledTime',
  'onOpen',
  'onClose',
  'onConfirm',
  'onChange',
  'onUpdate:open',
  'onUpdate:value',
  'required',
]);

const pickerProps = [...pickerbaseProps, ...pickerInputBaseProps];

export default defineVueComponent(Picker, pickerProps);
