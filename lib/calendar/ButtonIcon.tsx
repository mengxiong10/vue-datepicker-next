import { HTMLAttributes } from 'vue';
import { usePrefixClass } from '../context';

export interface ButtonIconProps extends HTMLAttributes {
  value: string;
}

export function ButtonIcon({ value, ...rest }: ButtonIconProps) {
  const prefixClass = usePrefixClass();

  return (
    <button
      {...rest}
      type="button"
      class={`${prefixClass}-btn ${prefixClass}-btn-text ${prefixClass}-btn-icon-${value}`}
    >
      <i class={`${prefixClass}-icon-${value}`}></i>
    </button>
  );
}
