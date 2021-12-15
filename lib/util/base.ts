import { PlainObject } from '../type';

/**
 * chunk the array
 * @param {Array} arr
 * @param {Number} size
 */
export function chunk<T>(arr: T[], size: number) {
  if (!Array.isArray(arr)) {
    return [];
  }
  const result = [];
  const len = arr.length;
  let i = 0;
  size = size || len;
  while (i < len) {
    result.push(arr.slice(i, (i += size)));
  }
  return result;
}

export function last<T = unknown>(array?: T[]) {
  return Array.isArray(array) ? array[array.length - 1] : undefined;
}

/**
 * isObject
 * @param {*} obj
 * @returns {Boolean}
 */
export function isPlainObject(obj: unknown): obj is PlainObject {
  return Object.prototype.toString.call(obj) === '[object Object]';
}

/**
 * pick object
 * @param {Object} obj
 * @param {Array|String} props
 */
export function pick<T extends PlainObject, K extends keyof T>(obj: T, props: K | K[]): Pick<T, K> {
  const res = {} as Pick<T, K>;
  if (!isPlainObject(obj)) return res;
  if (!Array.isArray(props)) {
    props = [props];
  }
  props.forEach((prop) => {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      res[prop] = obj[prop];
    }
  });
  return res;
}

/**
 * deep merge two object without merging array
 * @param {object} target
 * @param {object} source
 */
export function mergeDeep<T extends Record<string, any>, S extends Record<string, any>>(
  target: T,
  source: S
): T {
  if (!isPlainObject(target)) {
    return {} as T;
  }
  let result = target;
  if (isPlainObject(source)) {
    Object.keys(source).forEach((key) => {
      let value = source[key];
      const targetValue = target[key];
      if (isPlainObject(value) && isPlainObject(targetValue)) {
        value = mergeDeep(targetValue, value);
      }
      result = { ...result, [key]: value };
    });
  }
  return result;
}

export function padNumber(value: string | number) {
  const num = parseInt(String(value), 10);
  return num < 10 ? `0${num}` : `${num}`;
}

type CamelCase<T extends string> = T extends `${infer F}-${infer R}`
  ? `${F}${Capitalize<CamelCase<R>>}`
  : T;

export type Camelize<T> = { [K in keyof T as CamelCase<K & string>]: T[K] };

export function camelcase<T extends string>(str: T) {
  const camelizeRE = /-(\w)/g;
  return str.replace(camelizeRE, (_, c) => (c ? c.toUpperCase() : '')) as CamelCase<T>;
}
