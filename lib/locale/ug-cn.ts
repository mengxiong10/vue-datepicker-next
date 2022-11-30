import DatePicker from 'vue-datepicker-next';
import ugCN from 'date-format-parse/es/locale/ug-cn';

const lang = {
  formatLocale: ugCN,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
  buddhistYear: false,
};

DatePicker.locale('ug-cn', lang);

export default lang;
