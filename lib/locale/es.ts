import DatePicker from 'vue-datepicker-next';
import es from 'date-format-parse/es/locale/es';

const lang = {
  formatLocale: es,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('es', lang);

export default lang;
