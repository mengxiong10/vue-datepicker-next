import DatePicker from 'vue-datepicker-next';
import hi from 'date-format-parse/es/locale/hi';

const lang = {
  formatLocale: hi,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('hi', lang);

export default lang;
