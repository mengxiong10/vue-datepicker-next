(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('vue-datepicker-next')) :
  typeof define === 'function' && define.amd ? define(['vue-datepicker-next'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (global.DatePicker = global.DatePicker || {}, global.DatePicker.lang = global.DatePicker.lang || {}, global.DatePicker.lang.de = factory(global.DatePicker)));
}(this, (function (DatePicker) { 'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var DatePicker__default = /*#__PURE__*/_interopDefaultLegacy(DatePicker);

  var locale = {
    months: ['Január', 'Február', 'Marec', 'Apríl', 'Máj', 'Jún', 'Júl', 'August', 'September', 'Október', 'November', 'December'],
    monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Máj', 'Jún', 'Júl', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
    weekdays: ['Nedeľa', 'Pondelok', 'Utorok', 'Streda', 'Štvrtok', 'Piatok', 'Sobota'],
    weekdaysShort: ['Ned', 'Pon', 'Uto', 'Str', 'Štv', 'Pia', 'Sob'],
    weekdaysMin: ['Ne', 'Po', 'Ut', 'St', 'Št', 'Pi', 'So'],
    firstDayOfWeek: 1,
    firstWeekContainsDate: 1
  };

  const lang = {
      formatLocale: locale,
      yearFormat: 'YYYY',
      monthFormat: 'MMM',
      monthBeforeYear: true,
  };

  DatePicker__default['default'].locale('sk', lang);
  
  return lang;

})));
