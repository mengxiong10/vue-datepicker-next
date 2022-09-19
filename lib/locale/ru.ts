import DatePicker from 'vue-datepicker-next';
import ru from 'date-format-parse/es/locale/ru';

const lang = {
  formatLocale: ru,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ru', lang);

export default lang;
