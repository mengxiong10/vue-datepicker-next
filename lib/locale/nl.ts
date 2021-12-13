import DatePicker from 'vue-datepicker-next';
import nl from 'date-format-parse/es/locale/nl';

const lang = {
  formatLocale: nl,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('nl', lang);

export default lang;
