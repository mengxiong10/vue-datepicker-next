import { inject, computed, provide, Ref, shallowRef } from 'vue';
import { getWeek } from 'date-format-parse';
import { Locale } from './type';
import { getLocale } from './locale';
import { isPlainObject, mergeDeep } from './util/base';
import { DeepPartial } from 'utility-types';

const localeContextKey = 'datepicker_locale';
const prefixClassKey = 'datepicker_prefixClass';
const getWeekKey = 'datepicker_getWeek';

export function useLocale() {
  return inject<Ref<Locale>>(localeContextKey, shallowRef(getLocale()));
}
export function provideLocale(lang: Ref<string | DeepPartial<Locale> | undefined>) {
  const locale = computed(() => {
    if (isPlainObject(lang.value)) {
      return mergeDeep(getLocale(), lang.value);
    }
    return getLocale(lang.value);
  });

  provide(localeContextKey, locale);

  return locale;
}

export function providePrefixClass(value?: string) {
  provide(prefixClassKey, value);
}
export function usePrefixClass() {
  return inject(prefixClassKey, 'mx');
}

export function provideGetWeek(value?: typeof getWeek) {
  provide(getWeekKey, value);
}
export function useGetWeek() {
  return inject(getWeekKey, getWeek);
}
