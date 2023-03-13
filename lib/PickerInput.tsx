import { ref, InputHTMLAttributes, computed, SetupContext } from 'vue';
import { usePrefixClass } from './context';
import { IconClose, IconCalendar } from './svg';
import { ClassValue } from './type';
import { isValidDate, isValidDates, isValidRangeDate } from './util/date';
import { defineVueComponent, keys, withDefault } from './vueUtil';

// expose to datepicker
export interface PickerInputBaseProps {
  placeholder?: string;
  editable?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  inputClass?: ClassValue;
  inputAttr?: InputHTMLAttributes;
  range?: boolean;
  multiple?: boolean;
  separator?: string;
  renderInputText?: (v: Date | Date[]) => string;
  onInputError?: (text: string) => void;
  onClear?: () => void;
}

export interface PickerInputProps extends PickerInputBaseProps {
  value: Date | Date[];
  formatDate: (v: Date) => string;
  parseDate: (v: string) => Date;
  disabledDate: (v: Date) => boolean;
  onChange: (v: Date | Date[] | null | null[]) => void;
  onFocus: () => void;
  onBlur: () => void;
  onClick: () => void;
}

function PickerInput(originalProps: PickerInputProps, { slots }: SetupContext) {
  const props = withDefault(originalProps, {
    editable: true,
    disabled: false,
    clearable: true,
    range: false,
    multiple: false,
  });
  const prefixClass = usePrefixClass();

  const userInput = ref<string | null>(null);

  const innerSeparator = computed(() => {
    return props.separator || (props.range ? ' ~ ' : ',');
  });

  const isValidValue = (value: unknown) => {
    if (props.range) {
      return isValidRangeDate(value);
    }
    if (props.multiple) {
      return isValidDates(value);
    }
    return isValidDate(value);
  };

  const isDisabledValue = (value: Date | Date[]) => {
    if (Array.isArray(value)) {
      return value.some((v) => props.disabledDate(v));
    }
    return props.disabledDate(value);
  };

  const text = computed(() => {
    if (userInput.value !== null) {
      return userInput.value;
    }
    if (typeof props.renderInputText === 'function') {
      return props.renderInputText(props.value);
    }
    if (!isValidValue(props.value)) {
      return '';
    }
    if (Array.isArray(props.value)) {
      return props.value.map((v) => props.formatDate(v)).join(innerSeparator.value);
    }
    return props.formatDate(props.value);
  });

  const handleClear = (evt?: Event) => {
    if (evt) {
      evt.stopPropagation();
    }
    props.onChange(props.range ? [null, null] : null);
    props.onClear?.();
  };

  const handleChange = () => {
    if (!props.editable || userInput.value === null) return;
    const text = userInput.value.trim();
    userInput.value = null;
    if (text === '') {
      handleClear();
      return;
    }
    let date: Date | Date[];
    if (props.range) {
      let arr = text.split(innerSeparator.value);
      if (arr.length !== 2) {
        // Maybe the separator during the day is the same as the separator for the date
        // eg: 2019-10-09-2020-01-02
        arr = text.split(innerSeparator.value.trim());
      }
      date = arr.map((v) => props.parseDate(v.trim()));
    } else if (props.multiple) {
      date = text.split(innerSeparator.value).map((v) => props.parseDate(v.trim()));
    } else {
      date = props.parseDate(text);
    }
    if (isValidValue(date) && !isDisabledValue(date)) {
      props.onChange(date);
    } else {
      props.onInputError?.(text);
    }
  };

  const handleInput = (evt: string | Event) => {
    userInput.value = typeof evt === 'string' ? evt : (evt.target as HTMLInputElement).value;
  };

  const handleKeydown = (evt: KeyboardEvent) => {
    const { keyCode } = evt;
    // Tab 9 or Enter 13
    if (keyCode === 9) {
      props.onBlur();
    } else if (keyCode === 13) {
      handleChange();
    }
  };

  return () => {
    const showClearIcon = !props.disabled && props.clearable && text.value;

    const inputProps = {
      name: 'date',
      type: 'text',
      autocomplete: 'off',
      value: text.value,
      class: props.inputClass || `${prefixClass}-input`,
      readonly: !props.editable,
      disabled: props.disabled,
      placeholder: props.placeholder,
      ...props.inputAttr,
      onFocus: props.onFocus,
      onKeydown: handleKeydown,
      onInput: handleInput,
      onChange: handleChange,
    };

    return (
      <div class={`${prefixClass}-input-wrapper`} onClick={props.onClick}>
        {slots.input?.(inputProps) || <input {...inputProps} />}
        {showClearIcon ? (
          <i class={`${prefixClass}-icon-clear`} onClick={handleClear}>
            {slots['icon-clear']?.() || <IconClose />}
          </i>
        ) : null}
        <i class={`${prefixClass}-icon-calendar`}>
          {/* default icon config in DatePicker */}
          {slots['icon-calendar']?.() || <IconCalendar />}
        </i>
      </div>
    );
  };
}

export const pickerInputBaseProps = keys<PickerInputBaseProps>()([
  'placeholder',
  'editable',
  'disabled',
  'clearable',
  'inputClass',
  'inputAttr',
  'range',
  'multiple',
  'separator',
  'renderInputText',
  'onInputError',
  'onClear',
]);

const pickerInputProps = keys<PickerInputProps>()([
  'value',
  'formatDate',
  'parseDate',
  'disabledDate',
  'onChange',
  'onFocus',
  'onBlur',
  'onClick',
  ...pickerInputBaseProps,
]);

export default defineVueComponent(PickerInput, pickerInputProps);
