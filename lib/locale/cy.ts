import DatePicker from 'vue-datepicker-next';
import cy from 'date-format-parse/es/locale/cy';

const lang = {
  formatLocale: cy,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('cy', lang);

export default lang;
