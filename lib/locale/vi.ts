import DatePicker from 'vue-datepicker-next';
import vi from 'date-format-parse/es/locale/vi';

const lang = {
  formatLocale: vi,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: false,
};

DatePicker.locale('vi', lang);

export default lang;
