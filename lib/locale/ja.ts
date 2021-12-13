import DatePicker from 'vue-datepicker-next';
import ja from 'date-format-parse/es/locale/ja';

const lang = {
  formatLocale: ja,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('ja', lang);

export default lang;
