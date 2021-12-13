import DatePicker from 'vue-datepicker-next';
import arDZ from 'date-format-parse/es/locale/ar-dz';

const lang = {
  formatLocale: arDZ,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('ar-dz', lang);

export default lang;
