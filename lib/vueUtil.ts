import { DefineComponent, PropType, SetupContext, RenderFunction } from 'vue';
import { camelcase, Camelize } from './util/base';

type NonUndefinedable<T> = T extends undefined ? never : T;

export type DefinePropsToOptions<T> = {
  [K in keyof T]-?: Record<string, never> extends Pick<T, K>
    ? { type: PropType<NonUndefinedable<T[K]>> }
    : { type: PropType<T[K]>; required: true };
};

export function defineVueComponent<Props, PropsKeys extends (keyof Props)[], RawBindings = any>(
  setup: (props: Readonly<Props>, ctx: SetupContext) => RawBindings | RenderFunction,
  props: MustInclude<keyof Props, PropsKeys>
): DefineComponent<DefinePropsToOptions<Props>, RawBindings> {
  return { setup, name: setup.name, props } as any;
}

export function withDefault<Props extends Record<string, any>, DefaultProps extends Partial<Props>>(
  props: Props,
  defaultProps: DefaultProps
): Props & DefaultProps {
  const result = new Proxy(props, {
    get(target: Props, key: any) {
      const value = target[key];
      if (value !== undefined) {
        return value;
      }
      return defaultProps[key];
    },
  });
  return result as Props & DefaultProps;
}

type ValueOf<T> = T[keyof T];
type NonEmptyArray<T> = [T, ...T[]];
type MustInclude<T, U extends T[]> = [T] extends [ValueOf<U>] ? U : never;

export const keys =
  <T>() =>
  <U extends NonEmptyArray<keyof T>>(props: MustInclude<keyof T, U>) =>
    props;

export const resolveProps = <T extends Record<string, any>>(
  obj: T,
  booleanKeys: string[]
): Camelize<T> => {
  const props = {} as any;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const camelizeKey = camelcase(key);
      let value = obj[key] as any;
      // resolve empty string to true
      if (booleanKeys.indexOf(camelizeKey) !== -1 && value === '') {
        value = true;
      }
      props[camelizeKey] = value;
    }
  }
  return props;
};
