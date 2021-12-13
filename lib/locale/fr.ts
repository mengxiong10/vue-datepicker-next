import DatePicker from 'vue-datepicker-next';
import fr from 'date-format-parse/es/locale/fr';

const lang = {
  formatLocale: fr,
  yearFormat: 'YYYY',
  monthFormat: 'MMM',
  monthBeforeYear: true,
};

DatePicker.locale('fr', lang);

export default lang;
