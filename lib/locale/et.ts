import DatePicker from 'vue-datepicker-next';
import et from 'date-format-parse/es/locale/et';

const lang = {
  formatLocale: et,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('et', lang);

export default lang;
